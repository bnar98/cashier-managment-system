export const load = () => {
    let pages = [
        {
            meta: {
                dir: 'pages', title: 'فرۆشتن', icon: 'Envelope'
            },
            path: '/dashboard/sale'
        },
        {
            meta: {
                dir: 'pages', title: 'ڕاپۆرتی فرۆشتنی تاک', icon: 'Envelope'
            },
            path: '/dashboard/sales_report'
        },
        {
            meta: {
                dir: 'pages', title: 'زیادکرندنی کاڵا', icon: 'Envelope'
            },
            path: '/dashboard/add_product'
        },


    ]
    return {
        pages,
    }
}
