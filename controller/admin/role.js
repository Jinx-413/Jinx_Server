import Formidable from 'formidable'

class AdminRole {
  constructor() {
    this.getRole = this.getRole.bind(this)
  }

  async getRole(req, res) {
    const form = new Formidable.IncomingForm()
    form.parse(req, async(error, fields) => {
      if (!error) {
        console.log(fields)
      }
    })
  }
}

export default new AdminRole()
