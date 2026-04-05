  toggleSearch = () => {
    this.setState({
      showSearch: !this.state.showSearch,
    });
    document.querySelector('.mega-main-menu__actions-search--wrapper').classList.toggle('search--active');

    if (document.querySelector('.search--active')) {
      document.querySelector('.mega-main-menu .aa-Input').focus();

      if (document.querySelector('.login--active')) {
        this.loginList.classList.remove('login--shown');
        this.loginWrapper.classList.remove('login--active');
      }
    } else {
      document.querySelector('.mega-main-menu .mega-main-menu__nav-search-container .aa-Form').reset();
    }

    this.setState({
      showLoginForm: false,
    });
  }