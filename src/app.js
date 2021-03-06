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
        $('.loader').removeClass('is-hidden')
        $('.timeline').addClass('is-hidden')
        $('.profile').addClass('is-hidden')
        $('input').removeClass('is-danger')
        fetch('https://api.github.com/users/' + userName)
          .then(response => response.json())
          .then(function (body) {
            console.log(body);
            self.profile = body;
            self.update_profile();
          })
          .then(
            fetch('https://api.github.com/users/' + userName + '/events/public')
              .then(resp => resp.json())
              .then(function (data) {
                console.log(data);
                self.events = data;
                self.load_events();
              }
              )
              .catch((error) => {
                console.error('There has been a problem with your fetch operation:', error);
              })
          )
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

  load_events() {
    $('#user-timeline').empty()
    if (this.events.message === "Not Found") {
      $('<div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"> 404 = not found! User do not exist ;( ) </div></div>').appendTo('#user-timeline')
      $('#profile-name').text($('.username.input').val())
      $('#profile-image').attr('src', "")
      $('#profile-url').attr('href', "").text(" ")
      $('#profile-bio').text('(404 - user does not exist)')
    }
    else {
      this.events.forEach(e => {
        if (e.type === "PullRequestEvent" || e.type === "PullRequestReviewCommentEvent") {

          let date = new Date(e.created_at)
          let commentItem = e.type === "PullRequestReviewCommentEvent" ? ('<a href="' + e.payload.comment.html_url + '">' + ' comment ' + '</a> to ') : ''

          let timelineItem = $(
            '<aside class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content">' +
            '<p class="heading">' +
            date.toDateString() +
            '</p><div class="content"><span class="gh-username is-flex">' +
            '<img src="' + e.payload.pull_request.user.avatar_url + '"/>' +
            '<a href="' + e.payload.pull_request.user.html_url + '">' +
            e.payload.pull_request.user.login +
            '</a></span>' +
            e.payload.action +
            commentItem +
            '<a href="' + e.payload.pull_request.html_url + '">' +
            ' pull request' +
            '</a>' +
            '<p class="repo-name">' +
            '<a href="https://github.com/' + e.repo.name + '">' +
            e.repo.name +
            '</a></p></div></div></aside>');

          $(timelineItem).appendTo('#user-timeline')
        }
      });
    }

    if ($('#user-timeline').children().length < 1) {
      $('<div class="timeline-item"><div class="timeline-marker"></div><div class="timeline-content"> no data to load </div></div>').appendTo('#user-timeline')
    }
    $('.loader').addClass('is-hidden')
    $('.timeline').removeClass('is-hidden')
    $('.profile').removeClass('is-hidden')
  }
}
