import React from 'react';
import { connect } from 'react-redux';
import { Row, Col, Grid, Button, Glyphicon } from 'react-bootstrap';

import { setFilter, search } from '../../redux/actions/browser';

import FormBrowser from './FormBrowser';
import OrderByBrowser from './OrderByBrowser';
import ListBrowser from './ListBrowser';

let orderItems = [
	{
		value: 'currency',
		name: 'Currency'
	}, 
	{
		value: 'title',
		name: 'Name'
	},
	{
		value: 'geolocation',
		name: 'Geolocation'
	},
	{
		value: 'paymentoptions_display',
		name: 'Payment options'
	},
	{
		value: 'category',
		name: 'Category'
	}
]

class Browser extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Grid>
				<Col xs={12}>
					<FormBrowser onSearch={this.props.onSearch} browser={this.props.browser} />
					<OrderByBrowser items={orderItems} onOrder={this.props.onOrder}/>
					<ListBrowser items={this.props.browser.items}/>
				</Col>
			</Grid>
		);
	}
}

function mapStateToProps(state) {
	let browser = state.browser;

	return { browser };
}

function mapDispatchToProps(dispatch) {
	return {
		onSearch: (data) => {
			dispatch(search(data));
		},
		onFilter: (filter) => {
			dispatch(setFilter(filter));
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Browser);
