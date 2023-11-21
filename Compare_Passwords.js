  const _comparePassword = (pass1, pass2) => {
    var _NUM1 = ""
    var _NUM2 = ""
    for (var i = 0; i < String(pass1).length; i++) {
      _NUM1 = _NUM1 + "" + pass1.charCodeAt(i)
      _NUM2 = _NUM2 + "" + pass2.charCodeAt(i)
    }
    if (String(_NUM1) === String(_NUM2)) {
      return true
    } else {
      return false
    }
  }
