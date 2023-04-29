const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const getCurrentDate = () => {
    const newDate = new Date();
    const date = newDate.getDate();
    const month = newDate.getMonth();
    const year = newDate.getFullYear();

    const currentMonth = months[month];

    const fullCurrentDate = `${date} de ${currentMonth} ${year}`;

    return fullCurrentDate;
}

export {getCurrentDate}