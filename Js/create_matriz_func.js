let matriz_id = 1

function createMatriz(name) {
    const
        matriz_place = document.querySelector('.container-matriz'),

        div_tabela = createElement('div',
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
        config_menu = createElement('select',null, div_header)

    config_menu.addEventListener('change',(event)=>{
        const menu = event.target
        const matriz = menu.parentNode.parentNode
        selectFunctions(menu.value,matriz)
    })

    input_row.addEventListener('change', (event) => {
        const input = event.target
        const matriz = input.parentNode.parentNode
            
        const control_matriz_object =  matrizes_control_size[matriz.id]     

        if(input.value > 0){
            control_matriz_object.controlRow(input.value -1)
            refreshError()
        }else{
            showError('Coloque um número maior que 1 para acrescentar uma linha')
        }
    })
    input_col.addEventListener('change', (event) => {
        const input = event.target
        const matriz = input.parentNode.parentNode
            
        const control_matriz_object =  matrizes_control_size[matriz.id] 

        if(input.value > 0){
            control_matriz_object.controlCol(input.value -1)
            refreshError()
        }else{
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
        botao_matriz_show = createElement('button',null, div_btn_matriz_show),
        btn_img = createElement('img', {
            src: './img/arrdown.png',
            alt: 'arrow_down'
        }, botao_matriz_show)

    botao_matriz_show.addEventListener('click',(event)=>{
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
    salvar()
}

function createElement(element_name, attributes, who_append) {
    const element = document.createElement(element_name)

    if (attributes) {
        const attributes_array = Object.entries(attributes)
        attributes_array.forEach(([key, value]) => element.setAttribute(key, value))
    }

    if (who_append) {
        who_append.appendChild(element)
    }

    return element
}