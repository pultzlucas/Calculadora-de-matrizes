document.querySelector('#btn_addMatriz').addEventListener('click', createMatrizOrNo)
document.querySelector('#btn_delAllMatriz').addEventListener('click', delAllMatriz)
document.querySelector('#btn_calcular').addEventListener('click', () => {
    salvar()
    makeComand()
})
document.querySelector('#visor').addEventListener('focus', addOptionsToDatalist)
document.querySelector('#btn_clean').addEventListener('click', cleanTextarea)

/* Atalhos do teclado */

window.addEventListener('keyup', (event) => {
    const altShift = key => event.key === key && event.altKey && event.shiftKey
    const is_enter = event.key === 'Enter'

    if (altShift('A')) createMatrizOrNo()

    if (altShift('D')) delAllMatriz()

    if(altShift('L')) cleanTextarea()

    if (is_enter) {
        salvar()
        makeComand()
    }
})

