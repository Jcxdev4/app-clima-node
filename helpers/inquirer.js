import 'colors';
import inquirer from 'inquirer';

const preguntas = [
    {
        type: 'list',
        name: 'opciones',
        message: 'Que desea realizar ?',
        choices: [
            {
                value: 1,
                name: `${'1.'.blue} Buscar Ciudad`
            },
            {
                value: 2,
                name: `${'2.'.blue} Historial`
            },
            {
                value: 0,
                name: `${'0.'.blue} Salir`
            },
        ]
    }
];

export const inquirerMenu = async() => {
    console.clear();
    console.log('==========================='.green);
    console.log('   Seleccione una Opcion'.blue);
    console.log('===========================\n'.green);
    
    const {opciones} = await inquirer.prompt(preguntas);
    return opciones;
}

export const pausa = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presiona ${'ENTER'.green} para continuar`
        }
    ];
    
    console.log('\n')
    await inquirer.prompt(question)

}

export const leerInput = async(mensaje) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate( value ){
                if(value.length === 0){
                    return 'Por favor, Ingrese un valor'
                }
                return true
            }
        }
    ];

    const { desc } = await inquirer.prompt(question)
    return desc;
}

export const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map((lugar, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: lugar.id,
            name: `${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    });

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione una Ciudad: ',
            choices: choices
        }
    ];

    const {id} = await inquirer.prompt(preguntas);

    return id;
}

export const confirmar = async(mensaje) => {
    const question = [
        {
            type: 'confirm',
            name: 'ok',
            mensaje
        }
    ];

    const {ok} = await inquirer.prompt(question);
    return ok;
}

export const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map((tarea, i) => {
        const idx = `${i + 1}.`.green;

        return {
            value: tarea.id,
            name: `${idx} ${tarea.desc}`,
            checked: tarea.completadoEn ? true : false
        }
    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices: choices
        }
    ];

    const {ids} = await inquirer.prompt(pregunta);

    return ids;
}