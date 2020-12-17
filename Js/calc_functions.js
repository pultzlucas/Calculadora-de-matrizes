/* let matriz1 = [
    [1, 1],
    [1, 1]
]

let matriz2 = [
    [1, 1],
    [1, 1]
] */

/* 
=============================================================================================
    Funções para descobrir as linhas e colunas
=============================================================================================
*/
function linhas(mtx) {
    return mtx.length
}

function colunas(mtx) {
    return mtx[0].length
}


/* 
===============================================================================================
    Funções de auxilio
===============================================================================================
*/

function array_toMatriz(array, linhas = 1, colunas = 1) {
    let total = []
    for (let i = 0; i < linhas; i++) {
        total.push(array.slice(0, colunas))
        array.splice(0, colunas)
    }
    return total
}

function forEachMatriz(mtx, func, colOrRow = 'row') {
    let n = 0
    if (colOrRow === 'row') {
        for (let l = 0; l < linhas(mtx); l++) {
            for (let c = 0; c < colunas(mtx); c++) {
                func(mtx[l][c], l, c, n)
                n++
            }
        }
    }
    if (colOrRow === 'col') {
        for (let c = 0; c < colunas(mtx); c++) {
            for (let l = 0; l < linhas(mtx); l++) {
                func(mtx[l][c], l, c, n)
                n++
            }
        }
    }
}

function cof(linhas, colunas, submatriz) {
    return (-1) ** (linhas + colunas) * det(submatriz)
}
/* 
============================================================================================
    Validações
============================================================================================
*/

/* function matrizIsSquare(matriz) {
    return colunas(matriz) === linhas(matriz)
}

function allMatrizIsEquals(matrizes) {
    const is_array = typeof matrizes === 'object'
    if (is_array) {
        const validate = matrizes.every(e =>
            linhas(e) === linhas(matrizes[0]) &&
            colunas(e) === colunas(matrizes[0])
        )

        return validate
    }
    return true
} */

/* 
==============================================================================================
    Operações 
=============================================================================================
*/


function soma(...matrizes) {

    let array_soma = []
    const elements_to_som = matrizes.map(e => e.flat())

    for (let c = 0; c < colunas(elements_to_som); c++) {
        let soma = 0
        for (let l = 0; l < linhas(elements_to_som); l++) {
            soma += elements_to_som[l][c]
        }
        array_soma.push(soma)
    }

    const mtx = array_toMatriz(array_soma, linhas(matrizes[0]), colunas(matrizes[0]))
    return mtx
}


function sub(...matrizes) {
    let array_sub = []
    let elements_to_sub = matrizes.map(e=>e.flat())
    
    for (let c = 0; c < colunas(elements_to_sub); c++) {
        let sub = elements_to_sub[0][c]
        for (let l = 0; l < linhas(elements_to_sub) - 1; l++) {
            sub -= elements_to_sub[l + 1][c]
        }
        array_sub.push(sub)
    }
    
    const mtx = array_toMatriz(array_sub, linhas(matrizes[0]), colunas(matrizes[0]))
    return mtx
}
function multi(mtx1, mtx2) {
    let array_block = []
    let array_multi = []

    for (let l = 0; l < linhas(mtx1); l++) {
        for (let c = 0; c < colunas(mtx2); c++) {

            for (let ab = 0; ab < colunas(mtx1); ab++) {
                array_block.push(mtx1[l][ab] * mtx2[ab][c])
            }

            array_multi.push(array_block.reduce((acc,value)=>{
                acc += value
                return acc
            },0))

            array_block.splice(0, colunas(mtx1))
        }
    }
    return array_toMatriz(array_multi, linhas(mtx1), colunas(mtx2))
}


function n(mtx, n = 1) {
    const array_n_multi = []

    forEachMatriz(mtx, (_, l, c) => {
        array_n_multi.push(Number(parseFloat(n * mtx[l][c]).toFixed(3)))
    })

    const n_mtx = array_toMatriz(array_n_multi, linhas(mtx), colunas(mtx))
    return n_mtx
}
/* 
===================================================================================
    Matriz Oposta
======================================================================================
*/

function oposta(mtx) {
    return n(mtx, -1)
}

/* 
===================================================================================
    Matriz Identidade
======================================================================================
*/

function id(n) {
    let ordem = n
    if (typeof n === "object") {
        ordem = colunas(n)
    }
    let array_id = []

    for (let i1 = 0; i1 < ordem; i1++) {
        array_id.push(1)
        for (let i2 = 0; i2 < ordem; i2++) {
            array_id.push(0)
        }
    }
    return array_toMatriz(array_id, ordem, ordem)
}

/* 
===================================================================================
    Matriz Transposta 
======================================================================================
*/
function trans(mtx) {
    let array_trans = []

    forEachMatriz(mtx, (_, l, c) => {
        array_trans.push(mtx[l][c])
    }, 'col')
    return array_toMatriz(array_trans, colunas(mtx), linhas(mtx))
}

/* 
===================================================================================
    Matriz Adjunta
======================================================================================
*/

function adj(mtx) {
    const submtx = []
    const cofatores = []
    let index = () => { //função para armazenar os indices
        let idx = []
        for (let n = 0; n < linhas(mtx) * colunas(mtx); n++) {
            idx.push([])
            for (let c = 0; c < colunas(mtx); c++) {
                idx[n].push(c)
            }

        }
        return idx
    }

    let index_cols = () => {
        const ic = index()
        let i = 0
        while (i < linhas(ic)) {
            for (let c = 0; c < colunas(ic); c++) {
                ic[i].splice(c, 1)
                i++
            }
        }
        return ic
    }

    let index_rows = () => {
        const ir = index()
        forEachMatriz(mtx, (_, l, c, n) => {
            ir[n].splice(l, 1)
        })
        return ir
    }

    for (let n = 0; n < linhas(mtx) * colunas(mtx); n++) {
        submtx.push([])
        for (let l = 0; l < linhas(mtx) - 1; l++) {
            submtx[n].push([])
            for (let c = 0; c < colunas(mtx) - 1; c++) {
                submtx[n][l].push(mtx
                [index_rows()[n][l]]
                [index_cols()[n][c]]
                )
            }
        }
    }
    forEachMatriz(mtx, (_, l, c, n) => {
        cofatores.push(cof(l + 1, c + 1, submtx[n]))
    })

    mtx_cofatores = array_toMatriz(cofatores, linhas(mtx), colunas(mtx))

    return trans(mtx_cofatores)
}

/* 
===================================================================================
    Matriz Inversa 
======================================================================================
*/

function inv(mtx) {
    const mtx_adj = adj(mtx)
    const mtx_det = det(mtx)
    const mtx_inv = n(mtx_adj, (mtx_det ** -1))
    return mtx_inv
}

/* 
===================================================================================
    Determinantes 
======================================================================================
*/

function det(mtx) {
    if (linhas(mtx) === 1 && colunas(mtx) === 1) {
        return mtx[0][0]
    }

    const selected_row = mtx.shift()
    const det_cof = [] //armazena as matrizes menores
    const cofatores = []

    let index = () => { //função para armazenar os indices
        let idx = []
        for (let l = 0; l < linhas(mtx) + 1; l++) {
            idx.push([])
            for (let c = 0; c < colunas(mtx); c++) {
                idx[l].push(c)
            }
            idx[l].splice(l, 1)
        }
        return idx
    }

    for (let i = 0; i < colunas(mtx); i++) { //estrutura de repetição para extrair as submatrizes
        det_cof.push([])
        for (let l = 0; l < linhas(mtx); l++) {
            det_cof[i].push([])
            for (let c = 0; c < colunas(mtx) - 1; c++) {
                det_cof[i][l].push(mtx[l][index()[i][c]])
            }
        }
        cofatores.push(selected_row[i] * cof(1, i + 1, det_cof[i]))
    }

    const determinante = cofatores.reduce((acc,cofator)=>{
        acc += cofator
        return acc
    },0)

    return determinante

}