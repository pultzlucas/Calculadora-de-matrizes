
function treatErrors(raw_comand, edit_comand) {

    const transform_raw_comand_in_array = (raw_comand) => {
        const exp = /[(),]/gi

        const remove_comand_trash = raw_comand
            .replace(/ /g, '')
            .replace(exp, ' ')
            .trim()

        const split_comand = remove_comand_trash.split(' ')

        return split_comand.map(e => clearString(e))
        //Ex: before: soma(a,b) after: ["soma","a","b"]
    }

    const arr_block_comands = transform_raw_comand_in_array(raw_comand)


    const if_there_func_in_comand = arr_block_comands
        .map(e => func_names.includes(e))
        .some(e => e)

    const if_exist_mtz = Object.keys(matrizes_obj).length === 0

    const remove_funcs = (array) => array
        .filter(e => !func_names
            .includes(e))

    const if_there_mtz_in_comand = () => {
        let name_array = remove_funcs(arr_block_comands)

        let validate_names = name_array.map(e => {
            for (let name in matrizes_obj) {
                if (e === name || typeof Number(e) === 'number') {
                    return true
                }
            }
            return false
        })

        return validate_names.every(e => e)
    }

    const mtz_is_defined = () => {
        const names_of_matrizes = remove_funcs(arr_block_comands)
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

    const if_res_is_NaN = (res) => {
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
    
    const exist_an_element = ()=>{
        const comand_without_funcs = remove_funcs(arr_block_comands)
        const is_empty = comand_without_funcs.length === 0
        return is_empty
    }

    try {
        if (if_exist_mtz) throw new Error('Adicione uma matriz para fazer algum cálculo')

        if(exist_an_element()) throw new Error('Está faltando um elemento dentro de algum parênteses')

        if (!if_there_mtz_in_comand()) throw new Error('O nome de alguma matriz está incorreto ou a matriz não existe')

        if (!if_there_func_in_comand) throw new Error('Insira uma função para efetuar algum cálculo')

        if (mtz_is_defined().boolean) throw new Error(`A matriz ${mtz_is_defined().undefined_element} não existe`)

        if (if_res_is_NaN(eval(edit_comand))) throw new Error('Não é possível fazer o cálculo! Verifique se as matrizes estão corretas')

        salvar()
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