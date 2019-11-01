/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';

import { Container } from './styles';

export default class Repo extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('repo').name,
  });

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = { visible: true };

  hideSpinner() {
    this.setState({ visible: false });
  }

  render() {
    const { visible } = this.state;
    const { navigation } = this.props;
    const repo = navigation.getParam('repo');

    return (
      <>
        {visible && <ActivityIndicator size="large" color="#7159c1" />}
        <Container>
          <WebView
            originWhitelist={['*']}
            source={{ uri: repo.html_url }}
            style={{ flex: 1 }}
            onLoad={() => this.hideSpinner()}
          />
        </Container>
      </>
    );
  }
}
