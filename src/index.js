import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const API = 'https://cors.io/?https://pugme.herokuapp.com/bomb?count=100';

class Base extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			hits: [],
			loading: true,
		}
	}

	componentDidMount() {
		window.addEventListener("resize", this.resize);
    fetch(API)
      .then(response => response.json())
      .then(data => this.setState({ hits: data["pugs"], loading: false }));
  }

  resize = () => this.setState({windowHeight: window.innerHeight, windowWidth: window.innerWidth})

	componentWillUnmount() {
	  window.removeEventListener('resize', this.resize)
	}

  renderImage(imageUrl, index) {
  	if (this.state.loading) {
  		imageUrl = "https://i.imgur.com/0gp6vNn.gif";
  	}

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
  	const rowNumber = parseInt(index / numPerRow);

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

  	let leftOffset = (index % numPerRow) * (imageSize + 1.5);
  	let topOffset = rowNumber * (imageSize + 1.5);

    return (
      <div key={imageUrl + index}>
        <img className="container-box" style={{"left": leftOffset + "vw", "top" : topOffset + "vw", "width" : imageSize + "vw", "height" : imageSize + "vw"}} alt="" src={imageUrl} />
      </div>
    );
  }


	render() {
		let { hits } = this.state;
		if (hits.length === 0) {
			hits = Array(100).fill(null);
		}
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