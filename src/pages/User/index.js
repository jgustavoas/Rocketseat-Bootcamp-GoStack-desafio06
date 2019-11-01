/* eslint-disable react/state-in-constructor */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import { ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Loading,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  // eslint-disable-next-line react/static-property-placement
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    // url_rel: '',
    loading: false,
    loadingMore: false,
    refreshing: false,
    page: 1,
  };

  componentDidMount() {
    this.listStarred(1, true);
  }

  listStarred = async (page = 1, loading = false, loadingMore = false) => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ loading, loadingMore });

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    console.tron.log(response.headers.link);

    const { stars } = this.state;

    this.setState({
      stars: [...stars, ...response.data],
      // url_rel: response.headers.link,
      loading: false,
      loadingMore: false,
      refreshing: false,
      page,
    });
  };

  loadMore = () => {
    const { page } = this.state;

    const pageNumber = page + 1;

    this.setState({ page: pageNumber });

    this.listStarred(pageNumber, false, true);
  };

  refreshList = () => {
    this.setState({
      stars: [],
      loading: false,
      loadingMore: false,
      refreshing: true,
      page: 1,
    });
    this.listStarred(1, true);
  };

  handleNavigate = repo => {
    const { navigation } = this.props;

    navigation.navigate('Repo', { repo });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, loadingMore, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>
            <ActivityIndicator size="large" color="#7159c1" />
          </Loading>
        ) : (
          <Stars
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            onRefresh={this.refreshList}
            refreshing={refreshing}
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {loadingMore && (
          <Loading>
            <ActivityIndicator color="#7159c1" />
          </Loading>
        )}
      </Container>
    );
  }
}
