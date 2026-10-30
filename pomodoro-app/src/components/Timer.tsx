import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Vibration } from 'react-native';

const GREEN = '#1DA1F2';

export default function Timer() {
  const [workMinutes, setWorkMinutes] = useState('25');
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkPeriod, setIsWorkPeriod] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(parseInt(workMinutes, 10) * 60);
    }
  }, [workMinutes, breakMinutes, isRunning]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            Vibration.vibrate(500);
            const nextIsWork = !isWorkPeriod;
            setIsWorkPeriod(nextIsWork);
            const nextSec = (nextIsWork ? parseInt(workMinutes, 10) : parseInt(breakMinutes, 10)) * 60;
            return nextSec;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isWorkPeriod, workMinutes, breakMinutes]);

  const minutes = Math.floor(secondsLeft / 60).toString().padStart(2, '0');
  const seconds = (secondsLeft % 60).toString().padStart(2, '0');

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setIsWorkPeriod(true);
    setSecondsLeft(parseInt(workMinutes, 10) * 60);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.periodLabel}>{isWorkPeriod ? 'Work' : 'Break'} Period</Text>
      <Text style={styles.time}>{minutes}:{seconds}</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={handleStartPause}>
          <Text style={styles.buttonText}>{isRunning ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputsRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Work (min)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workMinutes}
            onChangeText={setWorkMinutes}
            editable={!isRunning}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Break (min)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={breakMinutes}
            onChangeText={setBreakMinutes}
            editable={!isRunning}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  periodLabel: {
    fontSize: 20,
    color: GREEN,
    marginBottom: 10,
  },
  time: {
    fontSize: 64,
    fontWeight: '200',
    color: '#000',
    marginVertical: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  button: {
    backgroundColor: GREEN,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
  },
  inputsRow: {
    flexDirection: 'row',
    marginTop: 20,
  },
  inputContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    width: 60,
    height: 40,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
});

