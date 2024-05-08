import "./LoadingSpinner.scss"

const LoadingSpinner = () => {
  return (
    <>
      <div className="loading-spinner" style={{ alignSelf: "center" }}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  )
}

export default LoadingSpinner
