import * as React from 'react'
import { validateGithubURL, validateGitlabUrl} from '../../utils/helper'

declare function require(path: string): any

export interface Props {
  onGithubSet?: (data) => void;
  githubData: {base?: string, id?: string, githubToken?: string};
  visible: boolean;
  settingSwitch: boolean;
}

export default class Settings extends React.Component<Props> {
  state = {
    githubRepo: '',
    githubToken: '',
    warning: ''
  }
  handleChange = e => {
    this.setState({[e.target.name]: e.target.value})
  }
  handleSubmit = e => {
    const { onGithubSet } = this.props
    const { githubRepo, githubToken } = this.state
    // const repo = validateGithubURL(githubRepo)
    const repo = validateGitlabUrl(githubRepo)
    if (!repo) {
      this.setState({warning: 'Gitlab Repository is required.'})
    } else if (!repo.base || !repo.id) {
      this.setState({warning: 'Gitlab Repository URL is invalid.'})
    } else if (!githubToken) {
      this.setState({warning: 'Gitlab Token is required.'})
    } else {
      const githubData = {
        base:repo.base,
        id: repo.id,
        githubToken: `${githubToken}`
      }
      parent.postMessage({ pluginMessage: { type: 'setGithubData', githubData } }, '*')
      onGithubSet(githubData)
    }
  }
  componentDidUpdate (prevPorps) {
    const { githubData, settingSwitch } = this.props
    if ((!prevPorps.githubData && githubData) || (prevPorps.settingSwitch !== settingSwitch)) {
      this.setState({
        githubRepo: `${githubData.base}/${githubData.id}`,
        githubToken: githubData.githubToken,
      })
    }
  }
  render () {
    const { visible, githubData } = this.props
    const { githubRepo, githubToken, warning } = this.state
    return (
      <div className={!visible ? 'hide' : ''}>
        <div className="onboarding-tip">
          <div className="onboarding-tip__icon">
            <div className="icon icon--smiley"></div>
          </div>
          <div className="onboarding-tip__msg">Hi, Welcome here. This plugin helps you convert icons to react component and publish to NPM. It should be used with Gitlab and NPM. Please read the docs before using.<br/><br/><a href="https://github.com/leadream/figma-icon-automation" target="_blank">Docs here</a></div>
        </div>
        {
          warning &&
          <div className="form-item">
            <div className="type type--pos-medium-normal alert alert-warning">{ warning }</div>
          </div>
        }
        <div className="form-item">
          <input
            name="githubRepo"
            className="input"
            placeholder="Gitlab Repository URL"
            onChange={this.handleChange}
            value={githubRepo}
          />
        </div>
        <div className="form-item">
          <input
            name="githubToken"
            className="input"
            placeholder="Gitlab Token"
            onChange={this.handleChange}
            value={githubToken}
          />
        </div>
        <div className="form-item">
          <button className='button button--primary button-block' onClick={this.handleSubmit}>
            {githubData ? 'Update' : 'Go'}
          </button>
        </div>
        <div className="setting-footer form-item type type--pos-medium-normal">
          developed by <a href="https://github.com/leadream" target="_blank">Leadream</a>
        </div>
      </div>
    )
  }
}
