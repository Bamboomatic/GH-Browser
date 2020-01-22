import './assets/scss/app.scss';
import $ from 'cash-dom';


export class App {
  initializeApp() {
    let self = this;

    $('.load-username').on('click', function (e) {
      e.preventDefault();
      let userName = $('.username.input').val();

      if (userName === '' || userName === null) {
        $('input').addClass('is-danger')
      }
      else if (!(/^[-a-zA-Z0-9_]*$/).test(userName)) {
        $('input').addClass('is-danger')
      }
      else {
        $('input').removeClass('is-danger')
        fetch('https://api.github.com/users/' + userName)
          .then(response => response.json())
          .then(function (body) {
            self.profile = body;
            self.update_profile();
          })
          .catch((error) => {
            console.error('There has been a problem with your fetch operation:', error);
          });
      }

    })

  }

  update_profile() {
    $('#profile-name').text($('.username.input').val())
    $('#profile-image').attr('src', this.profile.avatar_url)
    $('#profile-url').attr('href', this.profile.html_url).text(this.profile.login)
    $('#profile-bio').text(this.profile.bio || '(no information or user does not exist)')
  }
}
