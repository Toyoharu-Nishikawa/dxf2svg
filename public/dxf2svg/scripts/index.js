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

            let default_width =600;
            let default_height =600;
            let draw = SVG("svg-image-container").panZoom({zoomFactor:1.1});
            draw.width(default_width);
            draw.height(default_height);
            draw.attr('preserveAspectRatio', 'xMinYMin slice');
            draw.style( {
              border: '1px solid #F5F5F5',
              margin:0,
              padding:0,
              background:'linear-gradient(to bottom, white, RoyalBlue)'
            });
            draw.viewbox(0, 0, default_width, default_height).flip("y");
            let background = draw.group();
             background.line(0, 0, 1000, 0).fill("none").stroke({color:"black",opacity: 1.0,width:1})
              .attr("vector-effect", "non-scaling-stroke")
              .attr("stroke-dasharray","5 5");
            background.line(0, 0, 0, 1000).fill("none").stroke({color:"black",opacity: 1.0,width:1})
             .attr("vector-effect", "non-scaling-stroke")
             .attr("stroke-dasharray","5 5");
            draw.screen = draw.group();
            draw.screen.background = background;
            draw.screen.sheet = draw.screen.svg(svgString)
              .stroke({color:'blue',opacity: 1.0,width:1})
              .fill('none')
              .attr("stroke-linecap", "round")
              .attr("stroke-linejoin", "round");
            console.log(draw.screen.sheet.svg()) 
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
