export const maskCPF = (value: string): string => {
    let v = value.replace(/\D/g, '');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    v = v.replace(/(\d{3})(\d)/, '$1.$2');
    return v.replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
};

export const maskPhone = (value: string): string => {
    const v = value.replace(/\D/g, '');
    if (v.length > 10) {
        return v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3').slice(0, 15);
    }
    return v.replace(/^(\d{2})(\d{4})(\d{4}).*/, '($1) $2-$3').slice(0, 14);
};