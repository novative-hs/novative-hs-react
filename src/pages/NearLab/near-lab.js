
import React, { Component } from 'react';
// import './App.css';

export class locationInput extends Component {
  state = {
   location : '',
  }
handleChange = (e) => {
   this.setState({location: this.state.location})
  
		function initAutocomplete() {
			var input = document.getElementById('pac-input');
			var searchBox = new window.google.maps.places.SearchBox(input);
			searchBox.addListener('places_changed', function() {
				this.setState({ CollegeName: document.getElementById('pac-input').value });
			});
		}
  
		initAutocomplete();

}
	render() {
		return (
			<div>
				<input
					defaultValue={this.state.location}
					onChange={this.handleChange}
					id="pac-input"  // Do not change the value of id here. if you do, it wont work with google map API
					className="controls"
					type="text"
					placeholder="Search your College"
				/>
			</div>
		);
	}
}
export default locationInput