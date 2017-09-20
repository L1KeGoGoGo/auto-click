var id = 0;

var page = $('body');
var newQuery = page.find('#new');
var clearQuery = page.find('#reset');
var tpl = page.find('.template');
tpl.hide();

var inputs = [];
tpl.find("input").each(function () {
    inputs.push($(this).attr("class"));
});

function createQuery(id) {
    if ($('#row-' + id).length > 0) {
        return $('#row-' + id);
    }
    var c = tpl.clone();
    c.removeClass('template');
    tpl.parent().append(c);
    c.show();
    c.attr('id', 'row-' + id);
    c.find("input").each(function (i, v) {
        var $this = $(this);
        $this.attr('name', $this.attr("class") + '-' + id)
    });

    c.find('.remove').click(function () {
        c.remove();
        var id = c.attr('id').replace(/row-/, '');
        c.find("input").each(function (i, v) {
            var $this = $(this);
            localStorage.removeItem($this.attr("class") + '-' + id);
        });
    });
    return c;
}

newQuery.click(function () {
    $(".flash").removeClass("flash").removeClass("animated");
    createQuery(++id);
    return false;
});
clearQuery.click(function () {
    localStorage.clear();
    location.reload();
    return false;
});

page.find('input[type=checkbox]').each(function () {
    var key = $(this).attr('name');
    localStorage[key] = localStorage[key] || '';
    if (localStorage[key]) {
        $(this).attr('checked', 'checked');
    }
    $(this).change(function () {
        if ($(this).attr('checked')) {
            localStorage[key] = 'checked';
        } else {
            localStorage[key] = '';
        }
    });
});

page.on('keyup', 'input[type]', function () {
    var key = $(this).attr('name');
    localStorage[key] = $(this).val();
    if(key.indexOf('url') !== -1){
        $(this).parents("tr").find("td a").attr("href", localStorage[key])
    }
});
for (var k in localStorage) {
    if (k.match(/^(url|xpath|interval|count)-(\d+)/)) {
        var type = RegExp.$1;
        var id = RegExp.$2;
        var c = createQuery(id);
        c.find('.' + type).val(localStorage[k]);
        if (k.match(/^(url)-(\d+)/)) {
            c.find(".check").attr("href", localStorage[k]);
        }
    }
};