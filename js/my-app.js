var $$ = Dom7;

const productsTemplate = $$('script#productsTemplate').html();
const compiledProductsTemplate = Template7.compile(productsTemplate);

$$(document).on('pageInit', async function (e){
	if (e.detail.page.name === 'index') {
		$$('.posts').html('<div class="loader-wrapper"><span class="loader"></span></div>')
		const data = await fetchData(null)
		const products = await data.products
		if(products.length){
			products.forEach(product => {
				const html = compiledProductsTemplate({product});
				$$('.posts').append(html);
			})		
			$$('.loader-wrapper').remove();
		}
	}	
})
// Initialize your app
var myApp = new Framework7();

// Add view
var mainView = myApp.addView(".view-main", {
	dynamicNavbar: true,
});

$$('.custom-page').on('click',function(){
	mainView.router.loadContent($$('#customPage').html());
})

// product page
myApp.onPageInit("product", async function (page) {
	
	const id = page.query.id;
	const product = await fetchData(id);
	const productTemplate = $$('script#productTemplate').html();
	const compiledproductTemplate = Template7.compile(productTemplate);
	
	const discount = ((product.discountPercentage * product.price) / 100).toFixed(0);
	const salePrice = product.price - discount;
	
	const html = compiledproductTemplate({product, salePrice});
	$$('.product-container').append(html);
	myApp.swiper('.swiper-container', {
		pagination:'.swiper-pagination'
	});
});

// fetch data from api
// return the respones json data 
async function fetchData(id) {
	const url = 'https://dummyjson.com/products'
	var res 
	try {
		if (id) {
			// {} of single product
			res = await fetch(url + `/${id}`)
			
		}else{
			// else {} of |products, limit, total, skip| 
			res = await fetch(url)
		}		
	} catch (error) {
		console.log(error);
	}
	return await res.json()
}