if (id == 0) {
    var c = createQuery(++id);
    c.find('.url').val('https://dhruv-techapps.github.io/Auto-Click/test.html');
    c.find('.check').attr("href", 'https://dhruv-techapps.github.io/Auto-Click/test.html');
    c.find('.xpath').val('//*[@id="button"]');
    c.find('.interval').val(1);
    c.find('.count').val(100);
    c.find('input').trigger('keyup');

    c = createQuery(++id);
    c.find('.url').val('https://dhruv-techapps.github.io/Auto-Click/test.html');
    c.find('.check').attr("href", 'https://dhruv-techapps.github.io/Auto-Click/test.html');
    c.find('.xpath').val('//*[@id="test"]/div[2]/a[2]');
    c.find('.interval').val(2);
    c.find('.count').val(50);
    c.find('input').trigger('keyup');
}