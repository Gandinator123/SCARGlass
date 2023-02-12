import time
import smbus2  

bus = smbus2.SMBus(1)

i = 0
T0 = 0
T1 = 0
T2 = 0
T3 = 0
T4 = 0
Tav = 0
while True:
  # reset device
  bus.write_byte(0x40, 0xfe)
  time.sleep(.3)

  bus.write_byte(0x40, 0xF3)
  err = True
  while err:
    try:
      T_raw = bus.read_byte(0x40)
      t_raw = T_raw + (T_raw << 8)
      err = False
    except:
      time.sleep(0.01)
    
  # compute and save humidity and temp values
  i += 1
  T4 = T3
  T3 = T2
  T2 = T1
  T1 = T0
  T0 = 175.72*t_raw/65536.0 - 46.85

  Tav += T0
  Tav -= T4

  if i > 4:
    # print("current temp {0} ".format(T0))
    # print("average temp {0} ".format(Tav / 4))

    if T0 > (Tav / 4) + 0.5:
      print("Finger sensed")
  
  time.sleep(0.5)