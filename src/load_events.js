import { h, render, Component } from 'preact';

class TimelineItems extends Component {
    render() {
        return (
            <aside class="timeline-item">
                <div class="timeline-marker"></div>
                <div class="timeline-content">
                    <p class="heading">{date.toDateString()}</p>
                    <div class="content">
                        <span class="gh-username is-flex">
                            <img src="e.payload.pull_request.user.avatar_url" />
                            <a href="e.payload.pull_request.user.url">
                                {e.payload.pull_request.user.login}
                            </a>
                        </span>
                        {e.payload.action}
                        {commentItem}
                        <a href="e.payload.pull_request.url">
                            pull request
                        </a>
                        <p class="repo-name">
                            <a href="e.repo.url">
                                {e.repo.name}
                            </a>
                        </p>
                    </div>
                </div>
            </aside>
        );
    }
}

render(<TimelineItems />, document.body);