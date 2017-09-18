jQuery(function($) {
    var page = $('body');
    var newQuery = page.find('#new');
	var clearQuery = page.find('#reset');
    var tpl = page.find('.template');
    tpl.hide();
    var id = 0;

	var inputs = [];
	tpl.find("input").each(function(){
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
        c.find("input").each(function(i, v) {
            var $this = $(this);
            $this.attr('name', $this.attr("class") + '-' + id)
        });

        c.find('.remove').click(function() {
            c.remove();
            var id = c.attr('id').replace(/row-/, '');
            c.find("input").each(function(i, v) {
                var $this = $(this);
                localStorage.removeItem($this.attr("class") + '-' + id);
            });
        });
        return c;
    }

    newQuery.click(function() {
		$(".flash").removeClass("flash").removeClass("animated");
        createQuery(++id);
        return false;
    });
	clearQuery.click(function() {
		localStorage.clear();
        location.reload();
        return false;
    });

    page.find('input[type=checkbox]').each(function() {
        var key = $(this).attr('name');
        localStorage[key] = localStorage[key] || '';
        if (localStorage[key]) {
            $(this).attr('checked', 'checked');
        }
        $(this).change(function() {
            if ($(this).attr('checked')) {
                localStorage[key] = 'checked';
            } else {
                localStorage[key] = '';
            }
        });
    });

    page.on('keyup', 'input[type]', function() {
        var key = $(this).attr('name');
        localStorage[key] = $(this).val();
    });
    for (var k in localStorage) {
        if (k.match(/^(url|xpath|interval|count)-(\d+)/)) {
            var type = RegExp.$1;
            var id = RegExp.$2;
            var c = createQuery(id);
            c.find('.' + type).val(localStorage[k]);
			if(k.match(/^(url)-(\d+)/)){
				c.find(".check").attr("href",localStorage[k]);
			}
        }
    };

    if (id == 0) {
        var c = createQuery(++id);
        c.find('.url').val('https://dhruv-techapps.github.io/Auto-Click/test.html');
		c.find('.check').attr("href",'https://dhruv-techapps.github.io/Auto-Click/test.html');
        c.find('.xpath').val('//*[@id="button"]');
        c.find('.interval').val(1);
        c.find('.count').val(100);
        c.find('input').trigger('keyup');
		
		c = createQuery(++id);
        c.find('.url').val('https://dhruv-techapps.github.io/Auto-Click/test.html');
		c.find('.check').attr("href",'https://dhruv-techapps.github.io/Auto-Click/test.html');
        c.find('.xpath').val('//*[@id="test"]/div[2]/a[2]');
        c.find('.interval').val(2);
        c.find('.count').val(50);
        c.find('input').trigger('keyup');
		
    }
});