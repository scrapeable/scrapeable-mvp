// Function to calculate the start date based on the difference
function calculateStartDate(difference) {
    
    const currentDate = new Date();
    let startDate;

    if (difference === 'WTD') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay() + 1);
    } else if (difference === 'MTD') {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    } else if (difference === 'YTD') {
      startDate = new Date(currentDate.getFullYear(), 0, 1);
    } else {
      const value = parseInt(difference);
      if (!isNaN(value)) {
        let timeInMillis;
        
        if (difference.endsWith('D')) {
          timeInMillis = value * 24 * 60 * 60 * 1000;
        } else if (difference.endsWith('M')) {
          timeInMillis = value * 30 * 24 * 60 * 60 * 1000;
        } else if (difference.endsWith('Y')) {
          timeInMillis = value * 365 * 24 * 60 * 60 * 1000;
        } else {
          // Handle invalid difference values
          console.log('Invalid difference value');
          return;
        }
        
        startDate = new Date(currentDate.getTime() - timeInMillis);
      } else {
        // Handle invalid difference values
        console.log('Invalid difference value');
        return;
      }
    }
    
    return startDate.toISOString().split('T')[0];
}

// selectize search
$(document).ready(function() {

    // Declare startDate in a higher scope
    let startDate;

    // Get the button group
    const buttonGroup = document.querySelector('.btn-group');

    // Set the default active button (1Y)
    const defaultActiveButton = buttonGroup.querySelector('[data-difference="1Y"]');
    defaultActiveButton.classList.add('active');
    
    // Add click event listener to the button group
    buttonGroup.addEventListener('click', function(event) {
        const target = event.target;

        if (target.tagName === 'BUTTON') {
            const difference = target.dataset.difference;            
            startDate = calculateStartDate(difference, new Date());

                if (startDate) {
                    updateIframeUrl();

                    const previousActiveButton = buttonGroup.querySelector('.active');
                    if (previousActiveButton) {
                        previousActiveButton.classList.remove('active');
                    }
    
                    // Add the "active" class to the newly selected button
                    target.classList.add('active');

                }

        }

    });
    
    // Set default value for startDate when the webpage loads
    const defaultDifference = '1Y';
    
    startDate = calculateStartDate(defaultDifference, new Date());

        if (startDate) {
            // console.log(startDate);
            updateIframeUrl();
        }
    
    // Function to update the iframe URL with the current startDate
    function updateIframeUrl() {
        const selectize = $('#selectize')[0].selectize;
        if (selectize) {
            const selectedValue = selectize.getValue();
            if (selectedValue && startDate) {
                const iframe = document.getElementById('viz-frame');
                iframe.src = selectedValue + '&p.startDate=' + startDate;
                // console.log(selectedValue + '&p.startDate=' + startDate);
            }
        }
    }
    
    // replace wtih search engine URL
    $.getJSON("https://raw.githubusercontent.com/scrapeable/scrapeable-mvp/main/index.json", function(data) {
        
        // parse options
        // var options = JSON.parse(data).map(function(item) {
        //     return { 
        //         id: item.id, 
        //         id_name: item.id_name,
        //         dataset_short_name: item.dataset_short_name, 
        //         dataset_long_name: item.dataset_long_name, 
        //         visual_short_name: item.visual_short_name, 
        //         visual_long_name: item.visual_long_name, 
        //         value: item.value,
        //         command: item.command
        //     };
        // });

        var options = [
            // use this
            {id: 'AAPL', id_name: 'Apple Inc.', dataset_short_name: 'TV', dataset_long_name: 'TRADING VIEW', visual_short_name: 'C', visual_long_name: 'CHART', value: 'NASDAQ:AAPL', command: 'AAPL TV C'},
            {id: 'AAPL', id_name: 'Apple Inc.', dataset_short_name: 'FA', dataset_long_name: 'FINANCIAL ANALYSIS', visual_short_name: 'D', visual_long_name: 'DASHBOARD', value: 'https://us-east-2.quicksight.aws.amazon.com/sn/dashboards/30c8b96b-30e3-41ee-9087-6a7d94a390d8#p.pubID=AAPL', command: 'AAPL FA D'}
        ]
        
        // selectize element
        $("#selectize").selectize({
            valueField: "value",
            labelField: "command",
            searchField: ["id", "id_name", "dataset_short_name", "dataset_long_name", "visual_short_name", "visual_long_name"],
            maxOptions: 14,
            maxItems: 1,
            create: false,
            options: options,
            plugins: ["autofill_disable"],
            render: {
            option: 
                function(item, escape) {

                    return '<div class="option">' +
                    '<div class="column-l">' + '<b>' + escape(item.id) + '</b>' + ' - ' + '<small>' + escape(item.id_name) + '</small>' + '</div>' +
                    '<div class="column-l">' + '<b>' + escape(item.dataset_short_name) + '</b>' + ' - ' + '<small>' + escape(item.dataset_long_name) + '</small>' + '</div>' +
                    '<div class="column-r">' + '<b>' + escape(item.visual_short_name) + '</b>' + ' - ' + '<small>' + escape(item.visual_long_name) + '</small>' + '</div>' + 
                    '</div>';

                }
            },
            onItemAdd: function(value) {

                var iframeContainer = document.getElementById('container-viz-frame');
                // var iframe = document.getElementById('viz-frame');

                if (value.includes('us-east-2.quicksight.aws.amazon.com')) {
                    // quicksight iframe

                    // clear container-viz-frame
                    iframeContainer.innerHTML = '';
                    // create iframe on the fly
                    var iframe = document.createElement('iframe');
                    iframeContainer.appendChild(iframe);
                    iframe.id = 'viz-frame'; 
                    // paste value and startDate if applicable 
                    iframe.src = value + '&p.startDate=' + startDate; 

                }else if (value.includes('shinyapps.io')){
                    // shinyapp iframe

                    // clear container-viz-frame
                    iframeContainer.innerHTML = ''; 
                    // create iframe on the fly
                    var iframe = document.createElement('iframe');
                    iframeContainer.appendChild(iframe);
                    iframe.id = 'viz-frame';


                }else if (value.includes('digitalocean.com')){
                    // digital ocean iframe

                    // clear container-viz-frame
                    iframeContainer.innerHTML = ''; 
                    // create iframe on the fly
                    var iframe = document.createElement('iframe');
                    iframeContainer.appendChild(iframe);
                    iframe.id = 'viz-frame';

                }else if (value.length < 37){
                    // tradingview iframe

                    // tradingview config
                    var tvConfig = {
                        "autosize": true,
                        "symbol": value,
                        "interval": "D",
                        "timezone": "Etc/UTC",
                        "theme": "light",
                        "style": "1",
                        "locale": "en",
                        "enable_publishing": false,
                        "container_id": "tradingview-widget"
                    };
                
                    // trading view div html
                    var tvHTML = `
                        <div class="tradingview-widget-container">
                            <div id="tradingview-widget" style="height: calc(100vh - 100px);"></div>
                        </div>
                    `;
                
                    // append iframe to container
                    iframeContainer.innerHTML = tvHTML;
                    new TradingView.widget(tvConfig);

                }else{

                    console.log('Bad Value');

                }

            }

        });

    });

    const defaultStartDate = calculateStartDate(defaultDifference);

});
