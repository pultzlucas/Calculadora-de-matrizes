import workFlow from './workFlow.js'
import MatrizControlSize from './matrizControlSize.js'
//import treatErrors from './treat_errors.js'

document.querySelector('#btn_addMatriz').addEventListener('click', createMatrizOrNo)
document.querySelector('#btn_delAllMatriz').addEventListener('click', delAllMatriz)
document.querySelector('#btn_calcular').addEventListener('click', () => {
    save()
    makeComand()
})
document.querySelector('#visor').addEventListener('focus', addOptionsToDatalist)
document.querySelector('#btn_clean').addEventListener('click', cleanTextarea)

/* Atalhos do teclado */

window.addEventListener('keyup', event => {
    const altShift = key => event.key === key && event.altKey && event.shiftKey
    const is_enter = event.key === 'Enter'

    if (altShift('A')) createMatrizOrNo()
    if (altShift('D')) delAllMatriz()
    if (altShift('L')) cleanTextarea()

    if (is_enter) {
        save()
        makeComand()
    }
})

document.querySelector('#btn_addMatriz').addEventListener('click', createMatrizOrNo)
document.querySelector('#btn_delAllMatriz').addEventListener('click', delAllMatriz)
document.querySelector('#btn_calcular').addEventListener('click', () => {
    save()
    makeComand()
})

let matrizes_obj = {}
let func_names = ['soma', 'sub', 'multi', 'n', 'det', 'oposta', 'id', 'trans', 'adj', 'inv', 'colunas', 'linhas']
let matrizes_control_size = {}
let matriz_id = 1

delAllMatriz()

function resetObject(object) {
    for (let item in object) {
        delete object[item]
    }
}

function save() { //Atualizar todos os valores das matrizes e dos nomes
    const matriz_area = document.querySelector('.container-matriz')

    resetObject(matrizes_obj)
    let names = []
    let matrizes = []

    let all_tables_arr = []
    for (let i = 0; i < matriz_area.childNodes.length; i++) { //Salva valores no array
        const table_mtz = matriz_area.childNodes[i].querySelector('table')
        const cols = table_mtz.childNodes[0].childNodes.length
        const rows = table_mtz.childNodes.length

        all_tables_arr.push([])
        ForeachInputTable(table_mtz, e => {
            all_tables_arr[i].push(Number(e.firstChild.value))
        })
        matrizes.push([])
        for (let atm = 0; atm < rows; atm++) {
            matrizes[i].push(all_tables_arr[i].slice(0, cols))
            all_tables_arr[i].splice(0, cols)
        }
    }

    for (let name_of_matriz of matriz_area.childNodes) { //Salva nomes no array
        const name = name_of_matriz.querySelector('#matriz_name')
        names.push(name.innerHTML)
    }

    for (let i = 0; i < matriz_area.childNodes.length; i++) {//Salva valores e nomes e um obj
        matrizes_obj[workFlow.clearString(names[i])] = matrizes[i]
    }
}

function makeComand() {
    const visor = document.querySelector('#visor')

    const txt = visor.value
    const exp = /[^(),]+/gi

    const comands = txt.replace(exp, index => {
        let clean_index = workFlow.clearString(index)
        let reg_exp = RegExp(clean_index, 'gi')

        for (let name in matrizes_obj)
            if (reg_exp.test(name)) return `matrizes_obj["${clean_index}"]`

        for (let name of func_names)
            if (reg_exp.test(name)) return clean_index


        if (!isNaN(Number(index))) return Number(index)


    })

    scanForErrors(txt, comands)
}

function scanForErrors(txt, comands) {
    if (treatErrors(txt, comands)) {
        save()
        showRes(comands)
    }
}

function showRes(comands) {
    const txtarea = document.querySelector('textarea')
    const result_eval = eval(comands)

    const if_result_is_object = typeof result_eval === 'object'

    const transform_matriz_in_string = matriz =>
        matriz.map(e => e.join('    ')).join('\n\n')

    const result_string = if_result_is_object ?
        transform_matriz_in_string(result_eval) : result_eval

    txtarea.innerHTML = result_string
}

function addMatrizName(default_name = '') {
    let name = prompt(('Nome da matriz:').toUpperCase(), default_name)
    const canceled = name === null ? false : name

    return canceled
}

function createMatrizOrNo() {
    let name = addMatrizName(`Matriz${matriz_id}`)
    if (name) {
        matrizCreator(name)
        save()
    }
}

function delAllMatriz() {
    const matriz_place = document.querySelector('.container-matriz')
    while (matriz_place.firstChild) {
        matriz_place.removeChild(matriz_place.firstChild)
    }
    matriz_id = 1
    resetObject(matrizes_control_size)
}

let copy_values;

function selectFunctions(value, mtz) {
    const matriz_place = document.querySelector('.container-matriz')
    const table = mtz.querySelector('table')

    const
        reset_selected_index = () => {
            mtz.querySelector('select').selectedIndex = 0
        },

        cleanMatriz = () => {
            ForeachInputTable(table, input => input.firstChild.value = '' )
            document.querySelector('select').selectedIndex = 0
        },

        copyMatriz = () => {
            const cols = table.childNodes[0].childNodes.length
            const rows = table.childNodes.length
            let values = []
            
            ForeachInputTable(table, e => { values.push(Number(e.firstChild.value)) })

            const copyValues = () => {
                let copyValue = values.slice(0, cols)
                values.splice(0, cols)
                return copyValue
            }

            copy_values = workFlow.createEmptyArray(rows).map(copyValues)

            reset_selected_index()
        },

        pasteMatriz = () => {
            if (copy_values.length > 0) 
                ForeachInputTable(table, (e, l, c) => e.firstChild.value = copy_values[l][c])
            
            reset_selected_index()
        },

        renameMatriz = () => {
            const name_matriz = mtz.querySelector('div.mtx-header').querySelector('label')
            const new_name = addMatrizName(name_matriz.innerHTML)
            if (new_name) name_matriz.innerHTML = new_name

            reset_selected_index()
        },

        delMatriz = () => {
            matriz_place.removeChild(mtz)
            delete matrizes_control_size[mtz.id]
        }

    const what_func_call = [
        [value === 'Limpar matriz', cleanMatriz],
        [value === 'Copiar valores', copyMatriz],
        [value === 'Colar valores', pasteMatriz],
        [value === 'Renomear matriz', renameMatriz],
        [value === 'Deletar matriz', delMatriz],
    ]
    const call_func = what_func_call.find(e => e[0])[1]

    if (call_func) call_func()
}

function ForeachInputTable(table_element, func) {
    const table = table_element

    for (let l = 0; l < table.childNodes.length; l++) 
        for (let c = 0; c < table.childNodes[l].childNodes.length; c++) 
            func(table.childNodes[l].childNodes[c], l, c)
}

function showMatriz(mtz) {
    const table_hide_show = mtz.querySelector('table')
    const icon_btn = mtz.querySelector('img')

    const table_is_hide = table_hide_show.classList.value === 'hide'
    const image = table_is_hide ? './img/arrdown.png' : './img/arrup.png'
    const class_list = table_hide_show.classList

    icon_btn.removeAttribute('src')
    icon_btn.setAttribute('src', image)

    table_is_hide ? class_list.remove('hide') : class_list.add('hide')

}

function cleanTextarea() {
    const textarea = document.querySelector('#txtarea')
    textarea.innerHTML = ''
}

function addOptionsToDatalist() {
    let funcs = [
        'soma()', 'sub()', 'multi()', 'n()',
        'det()', 'oposta()', 'id()', 'trans()',
        'adj()', 'inv()', 'colunas()', 'linhas()'
    ]

    const datalist = document.querySelector('#func_list')

    datalist.innerHTML = ''
    for (let name of funcs) {
        const option = document.createElement('option')
        option.value = name
        datalist.appendChild(option)
    }
}


/* MATRIZ CREATOR */

function matrizCreator(name) {
    const { createElement } = workFlow

    const matriz_place = document.querySelector('.container-matriz')

    const div_tabela = createElement('div',
        { id: `mtx${matriz_id}`, class: 'tabela' }, matriz_place
    )

    /* DIV HEADER*/
    const
        div_header = createElement('div', { class: 'mtx-header' }, div_tabela),

        label_header = createElement('label', { id: 'matriz_name' }, div_header),

        input_row = createElement('input', {
            type: 'number',
            min: '1',
            max: '10',
            id: 'mtx_header_linhas',
        }, div_header),


        x = createElement('span', null, div_header),

        input_col = createElement('input', {
            type: 'number',
            min: '1',
            max: '10',
            id: 'mtx_header_colunas',
        }, div_header),
        config_menu = createElement('select', null, div_header)

    config_menu.addEventListener('change', (event) => {
        const menu = event.target
        const matriz = menu.parentNode.parentNode
        selectFunctions(menu.value, matriz)
    })

    input_row.addEventListener('change', (event) => {
        const input = event.target
        const matriz = input.parentNode.parentNode

        const control_matriz_object = matrizes_control_size[matriz.id]

        if (input.value > 0) {
            control_matriz_object.controlRow(input.value - 1)
            refreshError()
        } else {
            showError('Coloque um número maior que 1 para acrescentar uma linha')
        }
    })
    input_col.addEventListener('change', (event) => {
        const input = event.target
        const matriz = input.parentNode.parentNode

        const control_matriz_object = matrizes_control_size[matriz.id]

        if (input.value > 0) {
            control_matriz_object.controlCol(input.value - 1)
            refreshError()
        } else {
            showError('Coloque um número maior que 1 para acrescentar uma coluna')
        }
    })

    input_row.value = 1
    input_col.value = 1
    x.innerHTML = ' x '
    label_header.innerHTML = name


    /* BUTTON MATRIZ SHOW*/
    const
        div_btn_matriz_show = createElement('div', { class: 'btn-matriz-show' }, div_tabela),

        botao_matriz_show = createElement('button', null, div_btn_matriz_show),

        btn_img = createElement('img', {
            src: './img/arrdown.png',
            alt: 'arrow_down'
        }, botao_matriz_show)

    botao_matriz_show.addEventListener('click', event => {
        const botao = event.target
        const matriz = botao.parentNode.parentNode
        showMatriz(matriz)
        event.stopPropagation()
    })

    /* TABLE */
    const
        table = createElement('table', null, div_tabela),
        tr = createElement('tr', null, table),
        td = createElement('td', null, tr),
        input_matriz = createElement('input', { type: 'number' }, td)

    /* OPTIONS SELECT */
    const
        option_vazio = createElement('option', null, config_menu),
        limparM_option = createElement('option', null, config_menu),
        copiarM_option = createElement('option', null, config_menu),
        colarM_option = createElement('option', null, config_menu),
        renomearM_option = createElement('option', null, config_menu),
        deletarM_option = createElement('option', null, config_menu)

    limparM_option.innerHTML = 'Limpar matriz'
    copiarM_option.innerHTML = 'Copiar valores'
    colarM_option.innerHTML = 'Colar valores'
    renomearM_option.innerHTML = 'Renomear matriz'
    deletarM_option.innerHTML = 'Deletar matriz'

    matrizes_control_size[div_tabela.id] = new MatrizControlSize(table)
    matriz_id++
}

/* TREAT ERRORS */

function thereFuncInComand(array) {
    return array.map(e => func_names.includes(e)).some(e => e)
}

function removeFuncs(array) {
    return array.filter(e => !func_names.includes(e))
}

function thereMtzInComand(array) {
    let name_array = removeFuncs(array)

    let validate_names = name_array.map(e => {
        for (let name in matrizes_obj)
            if (e === name || typeof Number(e) === 'number') return true

        return false
    })

    return validate_names.every(name => name)
}

function mtzIsDefined(array) {
    const names_of_matrizes = removeFuncs(array)
    const matrizes_keys = Object.keys(matrizes_obj)
    const is_number = string => !isNaN(Number(string))

    const is_or_no = names_of_matrizes
        .map(name => {
            return matrizes_keys.includes(name) || is_number(name)
        })

    const boolean = is_or_no.includes(false)
    const undefined_element = names_of_matrizes[is_or_no.findIndex(e => !e)]

    return {
        boolean,
        undefined_element
    }
}

function resIsNaN(res) {
    const is_matriz = typeof res === 'object'
    const is_NaN_array = []
    const is_valid = element => isNaN(element) || element == Infinity
    if (is_matriz) {
        forEachMatriz(res, (element) => {
            is_NaN_array.push(is_valid(element))
        })

        return is_NaN_array.includes(true)
    }
    return isNaN(res)
}

function existAnElement(array) {
    const comand_without_funcs = removeFuncs(array)
    const is_empty = comand_without_funcs.length === 0
    return is_empty
}

function transformRawComandInArray(raw_comand) {
    const exp = /[(),]/gi
    const remove_comand_trash = raw_comand
        .replace(/ /g, '')
        .replace(exp, ' ')
        .trim()

    const split_comand = remove_comand_trash.split(' ')

    return split_comand.map(e => workFlow.clearString(e))
    //Ex: before: soma(a,b) after: ["soma","a","b"]
}

function treatErrors(raw_comand, edit_comand) {
    const arr_block_comands = transformRawComandInArray(raw_comand)
    const if_there_func_in_comand = thereFuncInComand(arr_block_comands)
    const if_exist_mtz = Object.keys(matrizes_obj).length === 0
    const if_there_mtz_in_comand = thereMtzInComand(arr_block_comands)
    const mtz_is_defined = mtzIsDefined(arr_block_comands)
    const exist_an_element = existAnElement(arr_block_comands)

    try {
        if (if_exist_mtz) throw new Error('Adicione uma matriz para fazer algum cálculo')
        if (exist_an_element) throw new Error('Está faltando um elemento dentro de algum parênteses')
        if (!if_there_mtz_in_comand) throw new Error('O nome de alguma matriz está incorreto ou a matriz não existe')
        if (!if_there_func_in_comand) throw new Error('Insira uma função para efetuar algum cálculo')
        if (mtz_is_defined.boolean) throw new Error(`A matriz ${mtz_is_defined.undefined_element} não existe`)
        if (resIsNaN(eval(edit_comand))) throw new Error('Não é possível fazer o cálculo! Verifique se as matrizes estão corretas')

        refreshError()
        return true

    } catch (error) {
        showError(error.message)
        return false
    }
}

function refreshError() {
    const err_box = document.querySelector('#error_box')
    document.querySelector('#visor').style.border = ''
    err_box.innerHTML = ''
}

function showError(error) {
    const err_box = document.querySelector('#error_box')
    err_box.innerHTML = error
    document.querySelector('#visor').style.border = 'solid 2px red'
}
