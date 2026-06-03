(function (  ) {
    'use strict';
const path = 'https://lampa.isroot.in';


	var uid = Lampa.Storage.get('lampa_uid', '');
	var lampa_add_on_email = Lampa.Storage.get('lampa_add_on_email', '')
	var lampa_cub_email = (Lampa.Storage.get('account', {}) || {}).email;
    var email = lampa_add_on_email || lampa_cub_email
	const SCRIPT_FOLDER = (function () {
		var src = (document.currentScript || document.scripts[document.scripts.length - 1]).src;
		return src.split('/').slice(-2, -1)[0];
	})();
	const Defined = {
		use_api: 'torrserver',
		localhost: path + '/' + SCRIPT_FOLDER + '/main.py',
	};
    if (Lampa && Lampa.Lang && typeof Lampa.Lang.add === 'function') {
        Lampa.Lang.add({
			lampa_add_on_settings: { ru: 'Lampa add-on', en: 'Lampa add-on', uk: 'Lampa add-on' },
			torrserver_on: { ru: 'Р’РєР»СЋС‡РµРЅ', en: 'On', uk: 'РЈРІС–РјРєРЅРµРЅРѕ' },
			torrserver_off: { ru: 'Р’С‹РєР»СЋС‡РµРЅ', en: 'Off', uk: 'Р’РёРјРєРЅРµРЅРѕ' },
			torrserver_name: { ru: 'РўРѕСЂСЂРµРЅС‚С‹ ...', en: 'Torrents ...', uk: 'РўРѕСЂСЂРµРЅС‚Рё ...' },
			torrserver_prowlarr_mod: { ru: 'Prowlarr РјРѕРґ', en: 'Prowlarr mod', uk: 'Prowlarr РјРѕРґ' },
			torrserver_vlc:	{ ru: 'Р—Р°РїСѓСЃРє С‚РѕСЂСЂРµРЅС‚РѕРІ С‡РµСЂРµР· VLC (Windows)', 		en: 'Playing torrents with VLC (Windows)',		uk: 'Р—Р°РїСѓСЃРє С‚РѕСЂРµРЅС‚С–РІ С‡РµСЂРµР· VLC (Windows)' },
			torrserver_changed: { ru: 'РР·РјРµРЅРµРЅРѕ РЅР°', en: 'Changed to', uk: 'Р—РјС–РЅРµРЅРѕ РЅР°' },
			
			torrserver_menu: { ru: 'РўРѕСЂСЂРµРЅС‚С‹ ...', en: 'Torrents ...', uk: 'РўРѕСЂСЂРµРЅС‚Рё ...' },
			torrserver_parser_use: { ru: 'РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ РїР°СЂСЃРµСЂ', en: 'Use parser', uk: 'Р’РёРєРѕСЂРёСЃС‚РѕРІСѓРІР°С‚Рё РїР°СЂСЃРµСЂ' },
            torrserver_select_torrserver: { ru: 'Р’С‹Р±РµСЂРёС‚Рµ Torrserver', en: 'Select Torrserver', uk: 'Р’РёР±РµСЂС–С‚СЊ Torrserver' },
            torrserver_loading_error: { ru: 'РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё', en: 'Loading error', uk: 'РџРѕРјРёР»РєР° Р·Р°РІР°РЅС‚Р°Р¶РµРЅРЅСЏ' },

			torrserver_search_history: 	{ ru: 'РСЃС‚РѕСЂРёСЏ РїРѕРёСЃРєР°', 		en: 'Search history', 		uk: 'Р†СЃС‚РѕСЂС–СЏ РїРѕС€СѓРєСѓ' 		},
			torrserver_new_search: 		{ ru: 'РќРѕРІС‹Р№ РїРѕРёСЃРє', 			en: 'New search', 			uk: 'РќРѕРІРёР№ РїРѕС€СѓРє' 			},
			torrserver_torrent_search: 	{ ru: 'РџРѕРёСЃРє С‚РѕСЂСЂРµРЅС‚РѕРІ', 		en: 'Search torrents', 		uk: 'РџРѕС€СѓРє С‚РѕСЂСЂРµРЅС‚С–РІ' 		},
			
			torrserver_use_current: 	{ ru: 'РСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РµРєСѓС‰РёР№', 	en: 'Use current', 			uk: 'Р’РёРєРѕСЂРёСЃС‚РѕРІСѓРІР°С‚Рё РїРѕС‚РѕС‡РЅРёР№'}
        });
    }
	const DEFAULT_IMG = 'https://lampa.isroot.in/static/img.png';
	var torrserver_network = new Lampa.Reguest(); 
	var torrserver_Api = { 
		servers: function(success, error){
			torrserver_request(
				Defined.localhost,
				function(data){
					if(!data || !data.parser_url || !data.torrserver_url){
						success(null);
						return;
					}
					
					var parserItems = [];
					data.parser_url.forEach(function(entry) {
					  var interview = 'healthy';
					  var url = '';
					  var key = '';
					  var type = 'jackett';
					  var rawEntry = entry;

					  if (entry.indexOf('#') === 0) {
						interview = 'all';
						url = entry.slice(1);
					  } else {
						var parts = entry.split('::');
						
						if (parts.length >= 1) {
						  if (parts[0].toLowerCase() === 'jackett' || parts[0].toLowerCase() === 'prowlarr') {
							type = parts[0].toLowerCase();
							if (parts.length >= 2) url = parts[1];
							if (parts.length >= 3) key = parts[2];
						  } else {
							url = parts[0];
							if (parts.length >= 2) key = parts[1];
						  }
						}
					  }
					  parserItems.push({
						title: formatUrlTitle(url),
						jackett_url: url,
						jackett_key: key,
						type: type,
						interview: interview,
						selected: false
					  });
					});	
					var torrserverItems = [];
					data.torrserver_url.forEach(function(entry) {
					  var url = '';
					  var login = '';
					  var password = '';
					  var auth = 'false';

					  var parts = entry.split('::');
					  if (parts.length >= 1) {
						url = parts[0];

						if (parts.length >= 2) {
							login = parts[1];
							auth = 'true';
						}
						if (parts.length >= 3) {
							password = parts[2];
						}
					  }

					  torrserverItems.push({
						title: formatUrlTitle(url),
						url: url,
						login: login,
						password: password,
						auth: auth,
						selected: false
					  });
					});					
					success({
						parsers: parserItems,
						torrservers: torrserverItems
					});
				},
				error
			);
		}
	};

	function torrserver_request(url, success, error){
		if (email){
			if (url.indexOf('account_email=') === -1)
				url = Lampa.Utils.addUrlComponent(url,'account_email='+encodeURIComponent(email));
			else
				url = url.replace(/account_email=[^&]+/,'account_email='+encodeURIComponent(email));
		}
		if (uid){
			if (url.indexOf('uid=') === -1)
				url = Lampa.Utils.addUrlComponent(url,'uid='+encodeURIComponent(uid));
			else
				url = url.replace(/uid=[^&]+/,'uid='+encodeURIComponent(uid));
		}
		torrserver_network.silent(url, success, error);
	}
	function safeTranslate(key, fallback) {
		if (Lampa && Lampa.Lang && typeof Lampa.Lang.translate === 'function') {
			return Lampa.Lang.translate(key) || fallback || key;
		}
		return fallback || key;
	}
	function formatUrlTitle(url){
		try {
			var u = new URL(url);
			return u.origin;
		} catch(e){
			return url;
		}
	}
	function startSearch(value){
		if(value){
			Lampa.Controller.toggle('content');
			saveSearchHistory('search_history_torrent', value);
			window['plugin_' + Defined.use_api + '_startTorrentSearch'](value);
		}
	}
	function saveSearchHistory(key, value){
		if(!value) return;
		let history = Lampa.Storage.get(key, []);
		history = history.filter(v => v !== value);
		history.unshift(value);
		history = history.slice(0, 25);
		Lampa.Storage.set(key, history);
	}
	function showSearchHistory(key, onSelect, onCancel){
		let history = Lampa.Storage.get(key, []);
		let items = [
			{ title: safeTranslate('torrserver_new_search'), value: '__new__' }
		];
		if(history.length){
			items = items.concat(
				history.map(v => ({title: v, value: v}))
			);
		}
		Lampa.Select.show({
			title: safeTranslate('torrserver_search_history'),
			items: items,
			onSelect: function(a){
				if(a.value === '__new__'){
					onCancel();
					return;
				}

				onSelect(a.value);
			},
			onBack: function(){
				Lampa.Controller.toggle('content');
			}
		});
	}
	function findSearchAndAdd() {
		var $menu = $('.head .open--search').eq(0);
		if ($menu.length) {
			var button = null;
			try {
				button = $(
					'<div class="head__action head__settings selector\">' +
					'	<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">' +
					'		<path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z" fill="currentColor"/>' +
					'	</svg>' +
					'</div>'
				);
				button.on('hover:enter', function() {  
					showSearchHistory(
						'search_history_torrent',
						startSearch,
						function(){
							Lampa.Input.edit({
								title: safeTranslate('torrserver_torrent_search'),
								value: '',
								free: true,
								nosave: false
							}, startSearch);
						}
					); 
				});
				$menu.after(button);
			} catch (e) {}
				
		} else {
			setTimeout(findSearchAndAdd, 200);
		}
	}	
	function findFilterAndAdd() {
		var button = $(
			'<div class="full-start__button selector view--torrent">' +
			'	<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 50 50" width="50px" height="50px">' +
			'		<path d="M25,2C12.317,2,2,12.317,2,25s10.317,23,23,23s23-10.317,23-23S37.683,2,25,2z M40.5,30.963c-3.1,0-4.9-2.4-4.9-2.4 S34.1,35,27,35c-1.4,0-3.6-0.837-3.6-0.837l4.17,9.643C26.727,43.92,25.874,44,25,44c-2.157,0-4.222-0.377-6.155-1.039L9.237,16.851 c0,0-0.7-1.2,0.4-1.5c1.1-0.3,5.4-1.2,5.4-1.2s1.475-0.494,1.8,0.5c0.5,1.3,4.063,11.112,4.063,11.112S22.6,29,27.4,29 c4.7,0,5.9-3.437,5.7-3.937c-1.2-3-4.993-11.862-4.993-11.862s-0.6-1.1,0.8-1.4c1.4-0.3,3.8-0.7,3.8-0.7s1.105-0.163,1.6,0.8 c0.738,1.437,5.193,11.262,5.193,11.262s1.1,2.9,3.3,2.9c0.464,0,0.834-0.046,1.152-0.104c-0.082,1.635-0.348,3.221-0.817,4.722 C42.541,30.867,41.756,30.963,40.5,30.963z" fill="currentColor"/>' +
			'	</svg>' +
			'	<span>' + safeTranslate('torrserver_menu') + '</span>' +
			'</div>'
		);
        Lampa.Listener.follow('full', function (e) {
          if (e.type == 'complite') {
            button.on('hover:enter', function () {
				chooseFilter(e.data)
            });
            if (e.data && e.object)
              e.object.activity.render().find('.view--torrent').first().replaceWith(button);  
          }
        });
	}
	function chooseFilter(movieData){
		torrserver_Api.servers(function(data){
			if (!data || !data.parsers.length) {
			  Lampa.Noty.show(safeTranslate('torrserver_loading_error'));
			  return;
			}

			var parserItems = [];
			if (Lampa.Storage.get('parser_torrent_type', '') === 'prowlarr') {
				var parser_url = Lampa.Storage.get('prowlarr_url', '')
			}else{
				var parser_url = Lampa.Storage.get('jackett_url', '')
			}
			if (
				Lampa.Storage.get('parser_use') === true &&
				parser_url
			) {
				parserItems.push({
					title: safeTranslate('torrserver_use_current'),
					subtitle: parser_url,
					use_current: true
				});
			}
			parserItems = parserItems.concat(data.parsers);
			
			Lampa.Select.show({
			  title: safeTranslate('torrserver_parser_use'),
			  items: parserItems,
			  onSelect: function onSelect(parser) {
				if (!parser.use_current) {
					Lampa.Storage.set('parser_use', 'true');  
					if (parser.type === 'prowlarr') {
					  Lampa.Storage.set('prowlarr_url', parser.jackett_url);
					  Lampa.Storage.set('prowlarr_key', parser.jackett_key);
					} else {
					  Lampa.Storage.set('jackett_url', parser.jackett_url);
					  Lampa.Storage.set('jackett_key', parser.jackett_key);
					}
					Lampa.Storage.set('parser_torrent_type', parser.type);
					Lampa.Storage.set('jackett_interview', parser.interview);
				}
				
				var torrserverItems = [];
				
				var my_servers = [
					{title: 'Сервер #1', url: 'http://111.111.111'},
					{title: 'Сервер #2', url: 'http://222.222.222'},
					{title: 'Сервер #3', url: 'http://333.333.333'},
					{title: 'Сервер #4', url: 'http://444.444.444'},
					{title: 'Сервер #5', url: 'http://555.555.555'},
					{title: 'Сервер #6', url: 'http://666.666.666'},
					{title: 'Сервер #7', url: 'http://777.777.777'},
					{title: 'Сервер #8', url: 'http://888.888.888'},
					{title: 'Сервер #9', url: 'http://999.999.999'},
					{title: 'Сервер #10', url: 'http://101.101.101'}
				];
				my_servers.forEach(function(s) {
					torrserverItems.push({ title: s.title, url: s.url, auth: 'false', login: '', password: '' });
				});
				
				Lampa.Select.show({
				  title: safeTranslate('torrserver_select_torrserver'),
				  items: torrserverItems,
				  onSelect: function onSelect(torr) {
					Lampa.Storage.set('torrserver_url', torr.url);
					Lampa.Storage.set('torrserver_auth', torr.auth);
					Lampa.Storage.set('torrserver_login', torr.login);
					Lampa.Storage.set('torrserver_password', torr.password);

					showSearch(movieData)
				  },
				  onBack: function onBack() {
					Lampa.Controller.toggle('content');
				  }
				});
			  },
			  onBack: function onBack() {
				Lampa.Controller.toggle('content');
			  }                  
			});	
		});
	}

	function chooseTorrserver(MagnetUri){
		torrserver_Api.servers(function(data){
			var torrserverItems = [];
			
			var my_servers = [
				{title: 'Сервер #1', url: 'http://111.111.111'},
				{title: 'Сервер #2', url: 'http://222.222.222'},
				{title: 'Сервер #3', url: 'http://333.333.333'},
				{title: 'Сервер #4', url: 'http://444.444.444'},
				{title: 'Сервер #5', url: 'http://555.555.555'},
				{title: 'Сервер #6', url: 'http://666.666.666'},
				{title: 'Сервер #7', url: 'http://777.777.777'},
				{title: 'Сервер #8', url: 'http://888.888.888'},
				{title: 'Сервер #9', url: 'http://999.999.999'},
				{title: 'Сервер #10', url: 'http://101.101.101'}
			];
			my_servers.forEach(function(s) {
				torrserverItems.push({ title: s.title, url: s.url, auth: 'false', login: '', password: '' });
			});
			
			Lampa.Select.show({
			  title: safeTranslate('torrserver_select_torrserver'),
			  items: torrserverItems,
			  onSelect: function onSelect(torr) {
				Lampa.Storage.set('torrserver_url', torr.url);
				Lampa.Storage.set('torrserver_auth', torr.auth);
				Lampa.Storage.set('torrserver_login', torr.login);
				Lampa.Storage.set('torrserver_password', torr.password);

				var torrentItem = {  
					MagnetUri: MagnetUri,
					title: 'title'
				}; 
				Lampa.Torrent.start(torrentItem);
			  },
			  onBack: function onBack() {
				Lampa.Controller.toggle('content');
			  }
			});
		});
	}
	function showSearch(data) {
	  var year = ((data.movie.first_air_date || data.movie.release_date || '0000') + '').slice(0, 4);
	  var combinations = {
		'df': data.movie.original_title,
		'df_year': data.movie.original_title + ' ' + year,
		'df_lg': data.movie.original_title + ' ' + data.movie.title,
		'df_lg_year': data.movie.original_title + ' ' + data.movie.title + ' ' + year,
		'lg': data.movie.title,
		'lg_year': data.movie.title + ' ' + year,
		'lg_df': data.movie.title + ' ' + data.movie.original_title,
		'lg_df_year': data.movie.title + ' ' + data.movie.original_title + ' ' + year
	  };
	  Lampa.Activity.push({
		url: '',
		title: safeTranslate('torrserver_menu'),
		component: 'torrents',
		search: combinations[Lampa.Storage.field('parse_lang')],
		search_one: data.movie.title,
		search_two: data.movie.original_title,
		movie: data.movie,
		page: 1
	  });
	};
    function prowlarrMod() {  
        const originalGet = Lampa.Parser.get;  
          
        Lampa.Parser.get = function(params, oncomplite, onerror) {  
            if (Lampa.Storage.field('parser_torrent_type') !== 'prowlarr') {  
                return originalGet.call(this, params, oncomplite, onerror);  
            }  
              
            const prowlarrUrl = Lampa.Storage.field('prowlarr_url');  
            const apiKey = Lampa.Storage.field('prowlarr_key');  
              
            if (!prowlarrUrl) {  
                onerror('Prowlarr URL not configured');  
                return;  
            }  
              
            let q = [];  
            q.push({name: 'apikey', value: apiKey || ''});  
            q.push({name: 'query', value: params.search});  
              
            if(!params.from_search){  
                const isSerial = !!(params.movie.original_name);  
                if (params.movie.number_of_seasons > 0) {  
                    q.push({name: 'categories', value: '5000'});  
                }  
                if (params.movie.original_language == 'ja') {  
                    q.push({name: 'categories', value: '5070'});  
                }  
                q.push({name: 'type', value: isSerial ? 'tvsearch' : 'search'});  
            }  
              
            const url = Lampa.Utils.buildUrl(prowlarrUrl, '/api/v1/search', q);  
              
            Lampa.Network.timeout(1000 * Lampa.Storage.field('parse_timeout'));  
              
            Lampa.Network.native(url, function(json) {  
                if(Array.isArray(json)) {  
                    let checked_at = Date.now();  
                    oncomplite({  
                        Results: json  
                            .filter((e) => e.protocol === 'torrent')  
                            .map((e) => {  
                                const hash = Lampa.Utils.hash(e.title);  
                                const timeValue = Lampa.Utils.strToTime(e.publishDate);  
                                  
                                return {  
                                    Title: e.title,  
                                    Tracker: e.indexer,  
                                    Size: e.size,  
                                    PublishDate: Lampa.Utils.strToTime(e.publishDate),  
                                    PublisTime: timeValue,  
                                    Seeders: parseInt(e.seeders),  
                                    Peers: parseInt(e.leechers),  
                                    MagnetUri: e.downloadUrl || e.magnetUrl,
                                    viewed: Lampa.Parser.viewed ? Lampa.Parser.viewed(hash) : false,  
                                    checked_at,  
                                    source_rank: 0,  
                                    hash  
                                };  
                            })  
                    });  
                } else {  
                    onerror('Invalid response format');  
                }  
            }, function(error) {  
                onerror(error);  
            });  
        };  
    }
	function startPlugin() {
        if (typeof $ !== 'function' || !Lampa) {
            return;
        }
		window['plugin_' + Defined.use_api + '_ready'] = true;

		let components = Lampa.SettingsApi.allComponents();
		if (!components['lampa_add_on_settings']) { 
			Lampa.SettingsApi.addComponent({  
				component: 'lampa_add_on_settings',
				icon:	'<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns=\"http://www.w3.org/2000/svg\">' +
						'	<circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="14"/>' +
						'	<polygon points="85,70 140,100 85,130" fill="currentColor"/>' + 
						'</svg>',  
				name: safeTranslate('lampa_add_on_settings'),
				
			});
		}
		
		let currentValue = Lampa.Storage.get('settings_' + Defined.use_api, 'on'); 
		let baseValues = { 
			'on': safeTranslate('torrserver_on'),
			'off': safeTranslate('torrserver_off') 
		}; 

		Lampa.SettingsApi.addParam({  
			component: 'lampa_add_on_settings',  
			param: {  
				name: 'plugin_' + Defined.use_api,  
				type: 'select',  
				values: baseValues,  
				default: currentValue  
			},  
			field: {  
				name: safeTranslate('torrserver_name'),  
			},  
			onChange: (value) => {  
				Lampa.Storage.set('settings_' + Defined.use_api, value);  
				Lampa.Noty.show(safeTranslate('torrserver_changed') + ': ' + baseValues[value]);  
			}  
		}); 

		let currentValueProwlarr = Lampa.Storage.get('settings_' + Defined.use_api + '_prowlarr_mod', 'off'); 
		let baseValuesProwlarr = { 
			'on': safeTranslate('torrserver_on'),
			'off': safeTranslate('torrserver_off') 
		}; 

		Lampa.SettingsApi.addParam({  
			component: 'lampa_add_on_settings',  
			param: {  
				name: 'plugin_' + Defined.use_api + '_prowlarr_mod',  
				type: 'select',  
				values: baseValuesProwlarr,  
				default: currentValueProwlarr  
			},  
			field: {  
				name: safeTranslate('torrserver_prowlarr_mod'),  
			},  
			onChange: (value) => {  
				Lampa.Storage.set('settings_' + Defined.use_api + '_prowlarr_mod', value);  
				Lampa.Noty.show(safeTranslate('torrserver_changed') + ': ' + baseValuesProwlarr[value]);  
			}  
		}); 

		let currentValueVLC = Lampa.Storage.get('settings_' + Defined.use_api + '_VLC', 'off'); 
		let baseValuesVLC = { 
			'on': safeTranslate('torrserver_on'),
			'off': safeTranslate('torrserver_off') 
		}; 

		Lampa.SettingsApi.addParam({  
			component: 'lampa_add_on_settings',  
			param: {  
				name: 'plugin_' + Defined.use_api + '_VLC',  
				type: 'select',  
				values: baseValuesVLC,  
				default: currentValueVLC  
			},  
			field: {  
				name: safeTranslate('torrserver_vlc'),  
			},  
			onChange: (value) => {  
				Lampa.Storage.set('settings_' + Defined.use_api + '_VLC', value);  
				Lampa.Noty.show(safeTranslate('torrserver_changed') + ': ' + baseValuesVLC[value]);  
			}  
		}); 

		if (currentValue === 'on') {
			findFilterAndAdd()
			findSearchAndAdd()

			window['plugin_' + Defined.use_api + '_startTorrentSearch'] = function(phrase) {
			  var movieData = {
				  movie: {
					title: phrase,
					original_title: phrase,
                    genres: [],  
                    overview: safeTranslate('torrserver_torrent_search'),  
					vote_average: 0,  
					production_countries: [],  
					poster: '/vaiSlJbN2hP0stVJmFyETbPDnvM.jpg',
					backdrop_path: '/vaiSlJbN2hP0stVJmFyETbPDnvM.jpg', 
					img: DEFAULT_IMG
				  }
			  };
			  chooseFilter(movieData);
			};
			window['plugin_' + Defined.use_api + '_startMagnetUri'] = function(MagnetUri) {		  
			  chooseTorrserver(MagnetUri);
			};
		}
		if (currentValueProwlarr === 'on') {
			prowlarrMod()
		}
		if (currentValueVLC === 'on') {
			Lampa.Player.listener.follow('create', function(e) {  
				let data = e.data;  
				if (data.torrent_hash) {
					e.abort();  
					
					window.location.href = 'lampavlc://' + data.url.replace('&preload','&play');  
					return; 
				}  
			}); 
		}
	}
	if (!window['plugin_' + Defined.use_api + '_ready']) startPlugin();
})( );
