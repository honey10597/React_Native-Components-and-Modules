  onChangeText={(val) => {
                  const onlyNumber = val.replace(/[^0-9]/g, '')
                  setNumber(onlyNumber)
                }}
