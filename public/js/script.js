$('#dataTable').dataTable({

    columnDefs: [{
    orderable: false,
    className: 'select-checkbox',
    targets: 0
    }],
    select: {
    style: 'os',
    selector: 'td:first-child'
    }
    });

$('.active').click(() => {
    $('.active').css({"color": "hsl(103, 77%, 49%)", "font-weight": "bold", "font-size": "16px !important"})
})