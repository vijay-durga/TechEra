import {Component} from 'react'

import {Link} from 'react-router-dom'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const appStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    appStatus: appStatusConstants.initial,
    courses: [],
  }

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    this.setState({appStatus: appStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/te/courses'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const fetchedData = data.courses.map(item => ({
        id: item.id,
        logoUrl: item.logo_url,
        name: item.name,
      }))
      this.setState({
        courses: fetchedData,
        appStatus: appStatusConstants.success,
      })
    } else {
      this.setState({appStatus: appStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" height="100" width="100" speed="fast" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png "
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getDetails}
      >
        Retry
      </button>
    </div>
  )

  successView = () => {
    const {courses} = this.state
    return (
      <div className="home-main-container">
        <h1 className="courses-title">Courses</h1>
        <ul className="courses-list-container">
          {courses.map(item => (
            <Link to={`/courses/${item.id}`} key={item.id}>
              <li className="list-item" key={item.id}>
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="item-image"
                />
                <button type="button" className="item-button">
                  {item.name}
                </button>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )
  }

  renderingFinalView = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case appStatusConstants.success:
        return this.successView()
      case appStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return this.renderFailureView()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderingFinalView()}
      </>
    )
  }
}
export default Home
