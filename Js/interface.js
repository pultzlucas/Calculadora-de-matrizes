document.querySelector('#btn_addMatriz').addEventListener('click', createMatrizOrNo)
document.querySelector('#btn_delAllMatriz').addEventListener('click', delAllMatriz)
document.querySelector('#btn_calcular').addEventListener('click', () => {
    salvar()
    makeComand()
})

let matrizes_obj = {}
let func_names = ['soma', 'sub', 'multi', 'n', 'det', 'oposta', 'id', 'trans', 'adj', 'inv', 'colunas', 'linhas']
let matrizes_control_size = {}

delAllMatriz()

function resetObject(object) {
    for (let item in object) {
        delete object[item]
    }
}

function salvar() { //Atualizar todos os valores das matrizes e dos nomes
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
        matrizes_obj[clearString(names[i])] = matrizes[i]
    }
    //console.log(matrizes_obj)
}

function makeComand() {
    const visor = document.querySelector('#visor')

    const txt = visor.value
    const exp = /[^(),]+/gi

    const comands = txt.replace(exp, index => {
        let clean_index = clearString(index)
        let reg_exp = RegExp(clean_index, 'gi')

        for (let name in matrizes_obj) {
            if (reg_exp.test(name)) {
                return `matrizes_obj["${clean_index}"]`
            }
        }
        for (let name of func_names) {
            if (reg_exp.test(name)) {
                return clean_index
            }
        }

        if (!isNaN(Number(index))) {
            return Number(index)
        }

    })

    scanForErrors(txt, comands)
}

function scanForErrors(txt, comands) {
    if (treatErrors(txt, comands)) {
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

function clearString(string) {
    const remove_spaces = string => string
        .replace(/ /g, '').trim()

    const remove_acents = string => string
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const remove_special_caracters = string => string
        .replace(/\W+/g, '')


    const clean_string_funcs = (string, funcs) => funcs
        .reduce((acc, func) => func(acc), string)
        .toLowerCase()

    const clean_string = clean_string_funcs(
        string,
        [remove_spaces, remove_acents, remove_special_caracters]
    )

    return clean_string
}

function addMatrizName(default_name = '') {
    let name = prompt(('Nome da matriz:').toUpperCase(), default_name)
    const canceled = name === null ? false : name

    return canceled
}

function createMatrizOrNo() {
    let name = addMatrizName(`Matriz${matriz_id}`)
    if (name) {
        createMatriz(name)
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

let copy_values = []
function selectFunctions(value, mtz) {
    const matriz_place = document.querySelector('.container-matriz')

    const
        reset_selected_index = () => {
            mtz.querySelector('select').selectedIndex = 0
        },


        cleanMatriz = () => {
            const table = mtz.querySelector('table')
            ForeachInputTable(table, e => { e.firstChild.value = '' })
            document.querySelector('select').selectedIndex = 0
        },

        copyMatriz = () => {
            const table = mtz.querySelector('table')
            let values = []
            copy_values = []

            ForeachInputTable(table, e => { values.push(Number(e.firstChild.value)) })

            const cols = table.childNodes[0].childNodes.length
            const rows = table.childNodes.length
            for (let i = 0; i < rows; i++) {
                copy_values.push(values.slice(0, cols))
                values.splice(0, cols)
            }
            reset_selected_index()
        },

        pasteMatriz = () => {
            const table = mtz.querySelector('table')

            if (copy_values.length > 0) {
                ForeachInputTable(table, (e, l, c) => {
                    e.firstChild.value = copy_values[l][c]
                })
            }
            reset_selected_index()
        },

        renameMatriz = () => {
            const name_matriz = mtz.querySelector('div.mtx-header').querySelector('label')
            const new_name = addMatrizName(name_matriz.innerHTML)
            const table = mtz.querySelector('table')
            if (new_name) {
                name_matriz.innerHTML = new_name
            }

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

    if (call_func) {
        call_func()
    }
}

function ForeachInputTable(table_element, func) {
    const table = table_element
    for (let l = 0; l < table.childNodes.length; l++) {
        for (let c = 0; c < table.childNodes[l].childNodes.length; c++) {
            func(table.childNodes[l].childNodes[c], l, c)
        }
    }
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

function cleanChildNodes(array_like) {
    let array = Array.from(array_like)
    return array.filter(e => e.nodeType != 3)
}

function cleanTextarea(){
    const textarea = document.querySelector('#txtarea')
    textarea.innerHTML = ''
}

function MatrizControlSize(table) {
    this.last_row_value = 0
    this.last_col_value = 0
    this.table = table
}


MatrizControlSize.prototype.controlRow = function(row_value) {
    const table_childs = cleanChildNodes(this.table.childNodes)
    const childs_of_tr = cleanChildNodes(table_childs[0].childNodes)

    const add_row = (amount) => { //AUMENTA LINHAS
        for (let row = 0; row < amount; row++) {
            let tr = createElement('tr')

            for (let col in childs_of_tr) {
                let td = createElement('td', null, tr)
                createElement('input', {
                    type: 'number'
                }, td)
            }
            this.table.appendChild(tr)
        }
    }

    const remove_row = (amount) => { //DIMINUI LINHAS
        for (let row = 0; row < amount; row++) {
            this.table.lastChild.remove()
        }
    }

    const amount_add = row_value - this.last_row_value
    const amount_remove = this.last_row_value - row_value

    row_value > this.last_row_value ? add_row(amount_add) : remove_row(amount_remove)


    this.last_row_value = row_value
}

MatrizControlSize.prototype.controlCol = function(col_value) {
    const table_childs = cleanChildNodes(this.table.childNodes)

    const add_col = (amount) => { //AUMENTA COLUNAS
        for (let col = 0; col < amount; col++) {
            for (let row of table_childs) {
                let td = createElement('td', null, row)
                createElement('input', {
                    type: 'number'
                }, td)
            }
        }
    }

    const remove_col = (amount) => { //DIMINUI COLUNAS
        for (let col = 0; col < amount; col++) {
            for (let row of table_childs) {
                row.lastChild.remove()
            }
        }
    }

    const amount_add = col_value - this.last_col_value
    const amount_remove = this.last_col_value - col_value

    col_value > this.last_col_value ? add_col(amount_add) : remove_col(amount_remove)

    this.last_col_value = col_value
}

function addOptionsToDatalist(){
    let funcs = ['soma()', 'sub()', 'multi()', 'n()', 'det()', 'oposta()', 'id()', 'trans()', 'adj()', 'inv()', 'colunas()', 'linhas()']
    const datalist = document.querySelector('#func_list')
    
    datalist.innerHTML = ''
    for(let name of funcs){
        const option = document.createElement('option')
        option.value = name
        datalist.appendChild(option)
    }
}

