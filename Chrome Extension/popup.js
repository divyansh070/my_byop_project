



document.addEventListener('DOMContentLoaded', function() {
    var sub = document.getElementById('sub');
    if (sub) {
        sub.addEventListener('click', function() {
            var news = document.getElementById('news').value;
            if (!news) {
                console.log('Error: News field is empty.');
                return;
            }
            const data = {"news": news};

            var request = new XMLHttpRequest();
            var url = 'http://127.0.0.1:5000/index';
            request.open('POST', url, true);
            request.setRequestHeader('Content-Type', 'application/json');

            request.onreadystatechange = function() {
                if (request.readyState === XMLHttpRequest.DONE) {
                    if (request.status === 200) {
                        try {
                            const response_data = JSON.parse(request.responseText);

                            if ('message' in response_data) {
                                
                                document.getElementById('finalAns').innerHTML = response_data.message;
                            } else if ('model_output' in response_data) {
                                
                                document.getElementById('finalAns').innerHTML = response_data.model_output;
                            } else {
                                console.log('Error: Unexpected response format');
                            }
                        } catch (error) {
                            console.log('Error parsing JSON response:', error);
                        }
                    } else {
                        console.log('Error: ', request.status);
                    }
                }
            };

            console.log('Sending data:', JSON.stringify(data));
            request.send(JSON.stringify(data));

            var i = 0;
            if (i == 0) {
                i = 1;
                var elem = document.getElementById("myBar");
                var width = 0;
                var id = setInterval(frame, 150);
                function frame() {
                    if (width >= 100) {
                        clearInterval(id);
                        i = 0;
                    } else {
                        width++;
                        elem.style.width = width + "%";
                        elem.innerHTML = width + "%";
                    }
                }
            }
        });
    }
});
