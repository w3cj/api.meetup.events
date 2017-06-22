function validationError(errors, instanceName) {
  const message = errors.reduce((all, e) => `${all}, ${e.stack}`, '').replace(/instance/g, instanceName);
  return Promise.reject(new Error(message));
}

module.exports = {
  validationError
};
