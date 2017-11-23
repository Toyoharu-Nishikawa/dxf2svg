$(document).ready(function() {
    "use strict";

    var bareFilename = null;
    var fileExtension = null;
    var filename = null;
    var svgString = null;

    $('#input-file-chooser').change(function() {
        var file = this.files[0];
        filename = file.name;
        var lastDotPosition = filename.lastIndexOf('.');
        bareFilename = filename.substr(0, lastDotPosition);
        fileExtension = filename.substr(lastDotPosition+1).toLowerCase();

        $(new FileReader()).load(function(event) {
            var fileData = event.target.result;
            $('.save-link').hide();

            switch (fileExtension) {
                case 'dxf':
                    svgString = dxfToSvg(fileData);
                    break;
                case 'svg':
                    svgString = fileData;
                    break;
                default:
                    return;
            }

            $('#svg-image').remove();

            if (svgString === null) {
                return;
            }

            var dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
            var svgImage = $('<img>', {id:'svg-image', src:dataUri});
            $('#svg-image-container').append(svgImage);
        })[0].readAsText(file);
    });

      $('#save-svg-link_new').click(function() {
        if (fileExtension === 'svg' || !svgString) {
            return;
        }
        saveStringAsFile(svgString, bareFilename+'.svg');
    });

      function saveStringAsFile(string, filename)
    {
        var blob = new Blob([string], {type: 'text/plain; charset=utf-8'});
        saveAs(blob, filename);
    }
});
