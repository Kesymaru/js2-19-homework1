(function() {
    const selectors = {
        form: '.bills_form',
        table: '.bills_table',
        total: '.bills_total'
    };
    const bills = new Bills();

    /**
     * Compose dummy data for the bills
     * @param {number} n total number of bills to add
     * @param {Table} table
     * @param {Total} total
     */
    function dummyData(n, table, total) {
        Array.from(Array(n).keys())
            .map(i => new Bill(
                `Dummy ${i}`,
                i ? i*100 : 100,
                Bill.TYPES[Math.floor(Math.random() * Bill.TYPES.length)]
            ))
            .forEach((bill, index) => {
                bills.add(bill);
                if(index === n-1) {
                    table.render();
                    total.render();
                }
            });
    }

    /**
     * Starts the classes instances
     */
    function init () {
        try {
            let table = new Table(selectors.table, bills);
            let total = new Total(selectors.total, bills);

            let form = new Form(selectors.form, bills, table, total);

            // compose dummy data
            dummyData(10, table, total);
        } catch (err) {
            console.error('Error on init the app', err)
        }
    }

    // when the dome is loaded
    document.addEventListener('DOMContentLoaded', init);

})();