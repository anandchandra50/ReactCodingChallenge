import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// use this to avoid CORS issues
const NUM_FETCH = 40 // number to fetch in each batch
const API = 'https://cors.io/?https://pugme.herokuapp.com/bomb?count=' + NUM_FETCH;

// base class, contains everything 
class Base extends React.Component {
	constructor(props) {
		super(props);
		this.fetchImages = this.fetchImages.bind(this);
		this.state = {
			hits: [], // fetched URLS
			loading: true, // whether currently loading URLs
		}
	}

	// function to fetch all images
	// cont is true when we should proceed with fetching
	fetchImages(cont = true) {
		if (!cont) { return }
		fetch(API)
		.then(response => response.json())
		.then(data => this.setState(
    	{ hits: this.state.hits.concat(data["pugs"].filter(url => !this.state.hits.includes(url))),
    	loading: false }
    ));
	}

	componentDidMount() {
		// add resize and scroll listener: update sizes when resized, fetch more when scrolled to bottom
		window.addEventListener("resize", this.resize);
		window.addEventListener("scroll", this.handleScroll);
		// fetch api link to get images
    this.fetchImages();
  }

  // set state for dynamic resizing
  resize = () => this.setState({windowHeight: window.innerHeight, windowWidth: window.innerWidth})
  // handle scroll manages the scrolls, fetches more 
  // sends argument cont, which is only true when at the bottom of the doc
  handleScroll = () => this.fetchImages(((window.innerHeight + window.scrollY) >= document.body.scrollHeight));

  // disconnect listeners
	componentWillUnmount() {
	  window.removeEventListener('resize', this.resize);
	  window.removeEventListener('scroll', this.handleScroll);
	}

	// this function displays an image at the given index
  renderImage(imageUrl, index) {
  	if (this.state.loading) {
  		// if loading, use loading placeholder
  		imageUrl = "https://i.imgur.com/0gp6vNn.gif";
  	}

  	// update the number of images per row depending on the screen size
  	let numPerRow = 1;
  	if (window.innerWidth > 300) {
  		numPerRow = 2;
  	}
  	if (window.innerWidth > 800) {
  		numPerRow = 3;
  	}
  	if (window.innerWidth > 1600) {
  		numPerRow = 4;
  	}

  	// row number is the number of the row that this image will be displayed in
  	const rowNumber = parseInt(index / numPerRow);

  	// determinate image size (in terms of viewport width) based off of how many images are in each row
  	// image size is calculated to leave 5 vw on either side of all images (for margin), and 1.5 vw in between each image
  	let imageSize;
  	switch(numPerRow) {
  		case 1:
  			imageSize = 90;
  			break;
  		case 2:
  			imageSize = 44.25;
  			break;
  		case 3:
  			imageSize = 29;
  			break;
  		case 4:
  			imageSize = 21.375;
  			break;
  		default:
  			break;
  	}

  	// calculate offsets based off index and num per row
  	let leftOffset = (index % numPerRow) * (imageSize + 1.5);
  	let topOffset = rowNumber * (imageSize + 1.5);

  	// return the image
    return (
      <div key={imageUrl + index}>
        <img className="container-box" style={{"left": leftOffset + "vw", "top" : topOffset + "vw", "width" : imageSize + "vw", "height" : imageSize + "vw"}} alt="" src={imageUrl} />
      </div>
    );
  }


  // display everything
	render() {
		let { hits } = this.state;
		if (hits.length === 0) {
			// if there's no hits, fill them all with placeholders
			hits = Array(NUM_FETCH).fill(null);
		}
		// display the page
		return (
			<div className="container-entire">
				<div className="container-headers">
					<h1 className="header-pug"><span className="header-name">ANAND'S </span>PUGS</h1>
				</div>
				<div className="container-all-images">
					{hits.map((imageUrl, index) => this.renderImage(imageUrl, index))}
				</div>
			</div>
		);
	}
}


ReactDOM.render(<Base />, document.getElementById("root"));