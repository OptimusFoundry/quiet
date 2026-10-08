// Dev loader: uses the compiled design-system bundle if present, otherwise compiles components/*.jsx in the browser (needs React + Babel standalone).
(function () {
  var FILES = ["core/Icon","core/Spinner","core/Button","core/ButtonGroup","core/ArrowLink","core/Link","core/Eyebrow","core/Headline","core/Text","core/Tag","core/Badge","core/Avatar","core/StatusDot","core/Skeleton","core/Wordmark","core/Rule","forms/Label","forms/FormHint","forms/FormField","forms/Input","forms/TextField","forms/TextArea","forms/Select","forms/Dropdown","forms/MultiSelect","forms/Checkbox","forms/Radio","forms/Switch","forms/Slider","forms/Stepper","forms/DatePicker","forms/FileUpload","display/Card","display/Stat","display/ProcessStep","display/Accordion","data/StatCard","data/EmptyState","data/FilterTabs","data/List","navigation/Tabs","navigation/NavBar","navigation/Breadcrumb","navigation/Pagination","navigation/StepIndicator","navigation/Sidebar","navigation/CommandPalette","data/Table","data/DataGrid","feedback/Dialog","feedback/Toast","feedback/Tooltip","feedback/Alert","feedback/Banner","feedback/Progress","overlays/Drawer","overlays/Popover","overlays/DropdownMenu","layout/Container","layout/GridOverlay","layout/Stack","layout/Grid","layout/Col","layout/AspectRatio","layout/PageHero","layout/SectionHeader","layout/PageShell","layout/PageTransition"];
  var cache = null;
  window.loadDS = function (base) {
    var found = null;
    Object.keys(window).some(function (k) {
      try { var v = window[k]; if (v && typeof v === 'object' && v !== window && v.Button && v.Headline) { found = v; return true; } } catch (e) {}
      return false;
    });
    if (found) return Promise.resolve(found);
    if (cache) return cache;
    cache = Promise.all(FILES.map(function (f) { return fetch(base + 'components/' + f + '.jsx').then(function (r) { return r.text(); }); }))
      .then(function (srcs) {
        var DS = {};
        srcs.forEach(function (src, i) {
          var name = FILES[i].split('/')[1];
          src = src.replace(/^import React.*$/mg, '')
                   .replace(/^import\s*\{([^}]*)\}\s*from.*$/mg, 'const {$1} = DS;')
                   .replace(/export function/g, 'function');
          var code = Babel.transform(src, { presets: ['react'] }).code;
          DS[name] = new Function('React', 'DS', code + '\nreturn ' + name + ';')(React, DS);
        });
        return DS;
      });
    return cache;
  };
})();
