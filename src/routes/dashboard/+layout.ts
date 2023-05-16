export const load = () => {
    let pages = [{
        meta: {
            dir: 'pages', title: 'contacts', icon: 'Envelope'
        },
        path: 'contact'
    },
    {
        meta: {
            dir: 'pages', title: 'about', icon: 'Envelope'
        },
        path: 'about'
    }]
    return {
        pages,
    }
}
