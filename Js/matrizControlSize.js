import workFlow from './workFlow.js'

class MatrizControlSize {
    constructor(table) {
        this.last_row_value = 0
        this.last_col_value = 0
        this.table = table
    }

    controlRow(row_value) {
        const table_childs = cleanChildNodes(this.table.childNodes)
        const childs_of_tr = cleanChildNodes(table_childs[0].childNodes)

        const add_row = (amount) => { //AUMENTA LINHAS
            for (let row = 0; row < amount; row++) {
                let tr = workFlow.createElement('tr')

                for (let col in childs_of_tr) {
                    let td = workFlow.createElement('td', null, tr)

                    workFlow.createElement('input', {
                        type: 'number'
                    }, td)
                }
                this.table.appendChild(tr)
            }
        }

        const remove_row = amount => { //DIMINUI LINHAS
            for (let row = 0; row < amount; row++) 
                this.table.lastChild.remove()
        }

        const amount_add = row_value - this.last_row_value
        const amount_remove = this.last_row_value - row_value

        row_value > this.last_row_value ? add_row(amount_add) : remove_row(amount_remove)


        this.last_row_value = row_value
    }

    controlCol(col_value) {
        const table_childs = cleanChildNodes(this.table.childNodes)

        const add_col = (amount) => { //AUMENTA COLUNAS
            for (let col = 0; col < amount; col++) {
                for (let row of table_childs) {
                    let td = workFlow.createElement('td', null, row)

                    workFlow.createElement('input', {
                        type: 'number'
                    }, td)
                }
            }
        }

        const remove_col = amount => { //DIMINUI COLUNAS
            for (let col = 0; col < amount; col++) {
                for (let row of table_childs) row.lastChild.remove()
            }
        }

        const amount_add = col_value - this.last_col_value
        const amount_remove = this.last_col_value - col_value

        col_value > this.last_col_value ? add_col(amount_add) : remove_col(amount_remove)

        this.last_col_value = col_value
    }

}

function cleanChildNodes(array_like) {
    let array = Array.from(array_like)
    return array.filter(e => e.nodeType != 3)
} 

export default MatrizControlSize