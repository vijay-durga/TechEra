import {Component} from 'react'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const appStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class CourseDetails extends Component {
  state = {appStatus: appStatusConstants.initial, courseDetails: []}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/te/courses/${id}`
    const response = await fetch(url)
    const data = await response.json()
    const reqData = data.course_details
    if (response.ok) {
      const fetchedData = {
        id: reqData.id,
        description: reqData.description,
        name: reqData.name,
        imageUrl: reqData.image_url,
      }
      this.setState({
        appStatus: appStatusConstants.success,
        courseDetails: fetchedData,
      })
    } else {
      this.setState({appStatus: appStatusConstants.failure})
    }
  }

  successView = () => {
    const {courseDetails} = this.state
    return (
      <div className="course-details-container">
        <img
          src={courseDetails.imageUrl}
          alt={courseDetails.name}
          className="course-image"
        />
        <div className="name-description-container">
          <h1 className="course-name">{courseDetails.name}</h1>
          <p className="course-description">{courseDetails.description}</p>
        </div>
      </div>
    )
  }

  failureView = () => (
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
        onClick={this.getCourseDetails()}
      >
        Retry
      </button>
    </div>
  )

  loadingView = () => (
    <div className="loader" data-testid="loader">
      <Loader type="ThreeDots" height="100" width="100" speed="fast" />
    </div>
  )

  renderingView = () => {
    const {appStatus} = this.state
    switch (appStatus) {
      case appStatusConstants.success:
        return this.successView()
      case appStatusConstants.failure:
        return this.failureView()
      default:
        return this.loadingView()
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderingView()}
      </>
    )
  }
}

export default CourseDetails
