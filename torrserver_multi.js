(function () {
    'use strict';

    function TorrServerMultiPlugin() {
        // Добавляем пункт TorrServer в главное меню Настроек Lampa, если его там еще нет
        Lampa.Settings.main = Lampa.Settings.main || {};
        
        // Создаем сам пункт меню в Настройках
        Lampa.Settings.add({
            title: 'TorrServer (Multi)',
            type: 'extended', // тип расширенных настроек
            name: 'torrserver', // имя компонента, на которое сработает ваш слушатель ниже
            icon: '<svg xmlns="http://w3.org" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y1="15"></line></svg>'
        });

        // 1. Инициализация кастомных настроек в Lampa
        Lampa.Settings.listener.follow('open', function (e) {
            if (e.name == 'torrserver') {
                var box = e.body;

                // Очищаем бокс от старых элементов (на случай повторного входа)
                box.empty();

                // Создаем массив с новыми полями для 4-х серверов
                var servers = [
                    { id: 'torr_srv_1', label: 'TorrServer #1 (Основной)' },
                    { id: 'torr_srv_2', label: 'TorrServer #2' },
                    { id: 'torr_srv_3', label: 'TorrServer #3' },
                    { id: 'torr_srv_4', label: 'TorrServer #4' }
                ];

                // Отрисовываем новые поля ввода в меню Lampa
                servers.forEach(function(srv) {
                    var html = $(
                        '<div class="settings-param selector">' +
                            '<div class="settings-param__name">' + srv.label + '</div>' +
                            '<div class="settings-param__value"></div>' +
                            '<div class="settings-param__descr">Укажите адрес TorrServer</div>' +
                        '</div>'
                    );

                    var current_val = Lampa.Storage.get(srv.id, '');
                    html.find('.settings-param__value').text(current_val || 'Не указан');

                    html.on('hover:enter', function () {
                        Lampa.Input.edit({
                            value: Lampa.Storage.get(srv.id, ''),
                            title: srv.label
                        }, function (new_val) {
                            if (new_val) {
                                Lampa.Storage.set(srv.id, new_val);
                                html.find('.settings-param__value').text(new_val);
                            } else {
                                Lampa.Storage.set(srv.id, '');
                                html.find('.settings-param__value').text('Не указан');
                            }
                        });
                    });

                    box.append(html);
                });

                // Добавляем переключатель активного сервера в данный момент
                var select_html = $(
                    '<div class="settings-param selector">' +
                        '<div class="settings-param__name">Активный TorrServer</div>' +
                        '<div class="settings-param__value"></div>' +
                    '</div>'
                );

                var active = Lampa.Storage.get('torr_srv_active', '1');
                select_html.find('.settings-param__value').text('Сервер #' + active);

                select_html.on('hover:enter', function () {
                    Lampa.Select.show({
                        title: 'Выбор TorrServer',
                        items: [
                            {title: 'Сервер #1', id: '1'},
                            {title: 'Сервер #2', id: '2'},
                            {title: 'Сервер #3', id: '3'},
                            {title: 'Сервер #4', id: '4'}
                        ],
                        onSelect: function (item) {
                            Lampa.Storage.set('torr_srv_active', item.id);
                            select_html.find('.settings-param__value').text(item.title);
                            
                            // Подменяем системную ссылку Lampa на выбранную нами
                            var target_url = Lampa.Storage.get('torr_srv_' + item.id, '');
                            Lampa.Storage.set('torrserver_url', target_url);
                        }
                    });
                });

                box.append(select_html);
            }
        });

        // 2. Хук на запуск плеера: проверяем, что ссылка актуальна перед стартом
        Lampa.Player.listener.follow('start', function() {
            var active_id = Lampa.Storage.get('torr_srv_active', '1');
            var real_url = Lampa.Storage.get('torr_srv_' + active_id, '');
            if (real_url) {
                Lampa.Storage.set('torrserver_url', real_url);
                Lampa.Storage.set('torrserver_url_use', 'main');
            }
        });
    }

    if (window.appready) TorrServerMultiPlugin();
    else Lampa.Listener.follow('app', function (e) { if (e.type == 'ready') TorrServerMultiPlugin(); });
})();
