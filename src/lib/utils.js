module.exports = {
/*  Function to calculate the person's age (current date - date of birth); */
    age(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()

        if (month < 0 || month == 0 && today.getDate() < birthDate.getDate()) {
            age = age - 1
        }
        return age
    },
/*  Function to convert the second mile date to html format (yyy-mm-dd); */
    date(timestamp) {
        
        const date = new Date(timestamp)
        // Lembre de usar o UTC;
        const year = date.getUTCFullYear()
        // Mês é contado de 0 a 11 por isso soma + 1;
        // Como transformamos em string aplicamos o método .slice(cortar) para pergamos somente
        // as casas decimais que precimos para o cáculo da data;
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        const day = `0${date.getUTCDate()}`.slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`, // retorno tipo iso
            birthDay: `${day}/${month}`,
            format: `${day}/${month}/${year}`
        }
    },
    formatCpf(value) {
        return value
            .replace(/\D/g,"")
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    },
    formatPhone(value) {
        return value
            .replace(/\D/g,"")
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')

    },
    getFirstName(value) {
        return value
            .replace(/(')/g, "$1'").split(' ').slice(0, -1).join(' ');
    }

}