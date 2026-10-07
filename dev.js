const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const isWindows = process.platform === 'win32';
const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('🤖 ===================================================');
console.log('🤖 [Workonnection] Dev Runner Iniciado');
console.log(`🤖 Sistema Operacional detectado: ${process.platform} (${isWindows ? 'Windows' : 'Unix/Linux/macOS'})`);
console.log('🤖 ===================================================\n');

// 1. Avisar de forma amigável caso os arquivos de configuração não existam
const frontEnvPath = path.join(frontendDir, '.env');
const backendLocalPropsPath = path.join(backendDir, 'src', 'main', 'resources', 'application-local.properties');

let hasMissingConfig = false;

if (!fs.existsSync(frontEnvPath)) {
  console.warn('⚠️  [AVISO] frontend/.env não foi encontrado.');
  console.warn('👉 Crie o arquivo frontend/.env (pode copiar de frontend/.env.example).\n');
  hasMissingConfig = true;
}

if (!fs.existsSync(backendLocalPropsPath)) {
  console.warn('⚠️  [AVISO] backend/src/main/resources/application-local.properties não foi encontrado.');
  console.warn('👉 Crie o arquivo application-local.properties com suas configurações locais.\n');
  hasMissingConfig = true;
}

if (hasMissingConfig) {
  console.log('ℹ️  Iniciando a aplicação mesmo assim...\n');
}

// 2. Instalação automática de dependências do frontend (se necessário)
const nodeModulesPath = path.join(frontendDir, 'node_modules');
function installFrontendDeps(callback) {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Instalando dependências do frontend (npm install)...');
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    const child = spawn(npmCmd, ['install'], {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: isWindows
    });
    child.on('close', (code) => {
      if (code === 0) callback();
      else {
        console.error(`npm install falhou com código ${code}`);
        process.exit(code);
      }
    });
  } else {
    callback();
  }
}

// 3. Liberação de portas para evitar conflitos (8080 e 5173)
function killPortProcess(port) {
  return new Promise((resolve) => {
    if (isWindows) {
      const findCmd = spawn('cmd.exe', ['/c', `netstat -ano | findstr :${port}`]);
      let output = '';
      findCmd.stdout.on('data', (d) => { output += d.toString(); });
      findCmd.on('close', () => {
        const lines = output.trim().split('\n').filter(Boolean);
        const pids = new Set();
        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && !isNaN(pid)) pids.add(pid);
        });
        pids.forEach((pid) => {
          try { spawn('taskkill', ['/pid', pid, '/f', '/t']); } catch (e) {}
        });
        resolve();
      });
    } else {
      const fuserCmd = spawn('fuser', ['-k', `${port}/tcp`]);
      fuserCmd.on('close', () => resolve());
      fuserCmd.on('error', () => {
        try {
          const lsof = spawn('sh', ['-c', `lsof -t -i :${port} | xargs -r kill -9`]);
          lsof.on('close', () => resolve());
          lsof.on('error', () => resolve());
        } catch (e) {
          resolve();
        }
      });
    }
  });
}

async function preparePorts() {
  console.log('🔍 Garantindo que portas 8080 e 5173 estão livres...');
  await killPortProcess(8080);
  await killPortProcess(5173);
}

// 4. Execução paralela do Backend e Frontend com Graceful Shutdown
function startApps() {
  installFrontendDeps(async () => {
    await preparePorts();
    console.log('\n🚀 Iniciando Backend (Spring Boot :8080) e Frontend (Vite :5173)...\n');

    const runningProcesses = [];

    // Iniciar Backend
    const mvnExecutable = isWindows ? 'mvnw.cmd' : './mvnw';
    const backendProc = spawn(mvnExecutable, ['spring-boot:run', '-Dspring-boot.run.profiles=local'], {
      cwd: backendDir,
      stdio: 'inherit',
      shell: isWindows,
      detached: !isWindows
    });
    runningProcesses.push(backendProc);

    // Iniciar Frontend
    const npmCmd = isWindows ? 'npm.cmd' : 'npm';
    const frontendProc = spawn(npmCmd, ['run', 'dev'], {
      cwd: frontendDir,
      stdio: 'inherit',
      shell: isWindows,
      detached: !isWindows
    });
    runningProcesses.push(frontendProc);

    async function cleanup() {
      console.log('\n🛑 Encerrando todos os serviços...');
      for (const p of runningProcesses) {
        if (p && !p.killed) {
          if (isWindows) {
            try { spawn('taskkill', ['/pid', p.pid, '/f', '/t']); } catch (e) {}
          } else {
            try {
              process.kill(-p.pid, 'SIGINT');
            } catch (e) {
              try { p.kill('SIGINT'); } catch (err) {}
            }
          }
        }
      }
      await killPortProcess(8080);
      await killPortProcess(5173);
      process.exit(0);
    }

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    backendProc.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\n⚠️  Backend finalizou com código ${code}`);
      }
    });

    frontendProc.on('close', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`\n⚠️  Frontend finalizou com código ${code}`);
      }
    });
  });
}

startApps();
