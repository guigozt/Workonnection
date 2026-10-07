const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const isWindows = process.platform === 'win32';
const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

console.log('🤖 ===================================================');
console.log('🤖 [Workonnection] Setup & Dev Bot Iniciado');
console.log(`🤖 Sistema Operacional detectado: ${process.platform} (${isWindows ? 'Windows' : 'Unix/Linux/macOS'})`);
console.log('🤖 ===================================================\n');

// 1. Criar frontend/.env
const frontEnvPath = path.join(frontendDir, '.env');
const frontEnvExamplePath = path.join(frontendDir, '.env.example');

if (!fs.existsSync(frontEnvPath)) {
  console.log('📄 [1/3] Criando frontend/.env...');
  if (fs.existsSync(frontEnvExamplePath)) {
    fs.copyFileSync(frontEnvExamplePath, frontEnvPath);
    console.log('✅ frontend/.env copiado de .env.example com sucesso!');
  } else {
    const frontEnvContent = [
      'VITE_API_URL=http://localhost:8080',
      'VITE_GOOGLE_CLIENT_ID=SEU_GOOGLE_CLIENT_ID',
      'VITE_PUSHER_KEY=SUA_PUSHER_KEY',
      'VITE_PUSHER_CLUSTER=sa1',
      ''
    ].join('\n');
    fs.writeFileSync(frontEnvPath, frontEnvContent, 'utf-8');
    console.log('✅ frontend/.env criado com sucesso!');
  }
} else {
  console.log('✔ frontend/.env já existe.');
}

// 2. Criar backend/src/main/resources/application-local.properties
const backendResourcesDir = path.join(backendDir, 'src', 'main', 'resources');
const backendLocalPropsPath = path.join(backendResourcesDir, 'application-local.properties');
const rootTemplatePropsPath = path.join(rootDir, 'application-local.properties.example');

if (!fs.existsSync(backendLocalPropsPath)) {
  console.log('📄 [2/3] Criando backend/src/main/resources/application-local.properties...');
  fs.mkdirSync(backendResourcesDir, { recursive: true });

  if (fs.existsSync(rootTemplatePropsPath)) {
    fs.copyFileSync(rootTemplatePropsPath, backendLocalPropsPath);
    console.log('✅ application-local.properties copiado do template local com sucesso!');
  } else {
    const localPropsContent = [
      '# BANCO DE DADOS',
      'spring.data.mongodb.uri=mongodb+srv://admin:work123@workonnection.zx5zgsb.mongodb.net/workonnection?retryWrites=true&w=majority&appName=Workonnection',
      '',
      '# SESSÃO',
      'server.servlet.session.cookie.same-site=lax',
      'server.servlet.session.cookie.secure=false',
      '',
      '# GOOGLE OAUTH2 (Preencha suas credenciais)',
      'spring.security.oauth2.client.registration.google.client-id=SEU_GOOGLE_CLIENT_ID',
      'spring.security.oauth2.client.registration.google.client-secret=SEU_GOOGLE_CLIENT_SECRET',
      'spring.security.oauth2.client.registration.google.scope=email,profile',
      'spring.security.oauth2.client.registration.google.redirect-uri={baseUrl}/login/oauth2/code/google',
      'spring.security.oauth2.client.registration.google.client-name=Google',
      '',
      '# EMAIL',
      'spring.mail.host=smtp.gmail.com',
      'spring.mail.port=587',
      'spring.mail.username=workonnection.fatec@gmail.com',
      'spring.mail.password=fapgzhaxauxibjfm',
      'spring.mail.protocol=smtp',
      'spring.mail.properties.mail.smtp.auth=true',
      'spring.mail.properties.mail.smtp.starttls.enable=true',
      '',
      '# FRONTEND',
      'app.frontend.url=http://localhost:5173',
      '',
      '# PUSHER',
      'pusher.app-id=2198562',
      'pusher.key=c839db74ed8f268ea65c',
      'pusher.secret=9f6b6a13e6609dd29be5',
      'pusher.cluster=sa1',
      ''
    ].join('\n');
    fs.writeFileSync(backendLocalPropsPath, localPropsContent, 'utf-8');
    console.log('✅ application-local.properties criado com sucesso!');
  }
} else {
  console.log('✔ application-local.properties já existe.');
}

// Verifica se foi passado argumento --setup-only
const args = process.argv.slice(2);
if (args.indexOf('--setup-only') !== -1) {
  console.log('\n✨ Setup concluído com sucesso (--setup-only solicitado).');
  process.exit(0);
}

// 3. Checar dependências do frontend
const nodeModulesPath = path.join(frontendDir, 'node_modules');
function installFrontendDeps(callback) {
  if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 [3/3] Instalando dependências do frontend (npm install)...');
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
    console.log('✔ Dependências do frontend já instaladas.');
    callback();
  }
}

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
        // Fallback para lsof/kill se fuser não estiver disponível
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
  console.log('🔍 Verificando portas 8080 e 5173...');
  await killPortProcess(8080);
  await killPortProcess(5173);
}

function startApps() {
  installFrontendDeps(async () => {
    await preparePorts();
    console.log('\n🚀 Iniciando Backend (Spring Boot :8080) e Frontend (Vite :5173)...\n');

    const runningProcesses = [];

    // Iniciar Backend (Spring Boot com profile local)
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
