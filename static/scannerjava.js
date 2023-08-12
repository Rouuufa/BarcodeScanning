function processImage() {
    var fileInput = document.getElementById('imageInput');
    var file = fileInput.files[0];

    if (file) {
        if (file.type && file.type.startsWith('image/')) {
            var formData = new FormData();
            formData.append('image', file);

            fetch('/process_image', {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (response.headers.get('content-type').indexOf('application/json') !== -1) {
                        return response.json();
                    } else {
                        return response.text();
                    }
                })
                .then(result => {
                    console.log('Result:', result); // Debug output
                    if (result.hasOwnProperty("barcode_data")){
                        openModalWithContent(result);
                    }
                    else{
                        document.getElementById("articleName").innerHTML = result.name;
                        document.getElementById("articleDescription").innerHTML = result.description;

                        displayArticleForm(result);

                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error processing image');
                });
        } else {
            alert('Please select an image file');
        }
    } else {
        alert('Please select an image file');
    }
}

function openModalWithContent(content) {
    var modal = document.getElementById('modal');
    var modalContent = document.getElementById('modal-content');
    modal.style.display = 'block';
    document.getElementById('barcodeData').value = content['barcode_data'] ;
    document.getElementById('barcodeType').value = content['barcode_type'] ;
}

function displayArticleForm(articleData) {
    var articleNameElement = document.getElementById('articleName');
    var articleDescriptionElement = document.getElementById('articleDescription');

    articleNameElement.value = articleData.name;
    articleDescriptionElement.value = articleData.description;


    const barcodeDataElement = document.getElementById('barcodeData');
    barcodeDataElement.textContent = articleData.barcode_data;


    submitArticleData(articleData.barcode_data, articleData.barcode_type);
}

function submitArticleData(barcodeData, barcodeType) {
    var barcodeDataInput = document.getElementById('barcodeData');
    var barcodeTypeInput = document.getElementById('barcodeType');
    barcodeDataInput.value = barcodeData;
    barcodeTypeInput.value = barcodeType;
}

function openModal() {
    var modal = document.getElementById('addArticleModal');
    modal.style.display = 'block';
}

function closeModal() {
    var modal = document.getElementById('addArticleModal');
    modal.style.display = 'none';
}

function submitArticle(event) {
    event.preventDefault();

    var articleNameInput = document.getElementById('articleNameModal');
    var articleDescriptionInput = document.getElementById('articleDescriptionModal');
    var barcodeDataInput = document.getElementById('barcodeData');
    var barcodeTypeInput = document.getElementById('barcodeType');

    var articleName = articleNameInput.value;
    var articleDescription = articleDescriptionInput.value;
    var barcodeData = barcodeDataInput.value;
    var barcodeType = barcodeTypeInput.value;



const jsonData = {
    'name': articleName,
    'description': articleDescription,
    'barcodeData' : barcodeData,
    'barcodeType' : barcodeType,
  };
  
  const url = '/add_article';
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  };
  
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      console.log('Response data:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  

    articleNameInput.value = '';
    articleDescriptionInput.value = '';
}
function listArticles() {
    fetch('/list_articles')
        .then(response => response.json())
        .then(articles => {
            const articleListElement = document.getElementById('articleList');
            articleListElement.innerHTML = '';

            articles.forEach(article => {
                const articleItem = document.createElement('div');
                articleItem.classList.add('article-item');
                articleItem.innerHTML = `<p>Name: ${article.name}</p><p>Description: ${article.description}</p><p>Barcode_data: ${article.barcode_data}</p><p>Barcode_type: ${article.barcode_type}</p><hr>`;
                articleListElement.appendChild(articleItem);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error listing articles');
        });
}
function openManualAddArticleModal() {
    var modal = document.getElementById('manualAddArticleModal');
    modal.style.display = 'block';
}

function closeManualAddArticleModal() {
    var modal = document.getElementById('manualAddArticleModal');
    modal.style.display = 'none';
}

function submitManualArticle(event) {
    event.preventDefault();

    var manualArticleNameInput = document.getElementById('manualArticleName');
    var manualArticleDescriptionInput = document.getElementById('manualArticleDescription');
    var manualBarcodeDataInput = document.getElementById('manualBarcodeData');
    var manualBarcodeTypeInput = document.getElementById('manualBarcodeType');

    var manualArticleName = manualArticleNameInput.value;
    var manualArticleDescription = manualArticleDescriptionInput.value;
    var manualBarcodeData = manualBarcodeDataInput.value;
    var manualBarcodeType = manualBarcodeTypeInput.value;

    const manualJsonData = {
        'name': manualArticleName,
        'description': manualArticleDescription,
        'barcodeData': manualBarcodeData,
        'barcodeType': manualBarcodeType,
    };

    const manualUrl = '/add_article';

    const manualOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(manualJsonData)
    };

    fetch(manualUrl, manualOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Response data:', data);
            closeManualAddArticleModal();
        })
        .catch(error => {
            console.error('Error:', error);
        });

    manualArticleNameInput.value = '';
    manualArticleDescriptionInput.value = '';
    manualBarcodeDataInput.value = '';
    manualBarcodeTypeInput.value = '';
}
