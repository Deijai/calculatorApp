import { useEffect, useRef, useState } from 'react'

enum Operator {
    add = '+',
    subtract = '-',
    multiply = '*',
    divide = '/',
}

export const useCalculator = () => {
    const [formula, setFormula] = useState('');

    const [number, setNumber] = useState('0');
    const [prevNumber, setPrevNumber] = useState('0');

    const lastOperation = useRef<Operator>();


    useEffect(() => {
        if (lastOperation.current) {
            const firstFormulaPart = formula.split(' ').at(0);
            setFormula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
        } else {
            setFormula(number);
        }
    }, [number]);



    useEffect(() => {
        const subResult = calculateSubResult();
        setPrevNumber(`${ subResult }`)
    }, [formula]);






    const buildNumber = (numberString: string) => {

        if (number.includes('.') && numberString === '.') return;

        if (number.startsWith('0') || number.startsWith('-0')) {
            if (numberString === '.') {
                return setNumber(number + numberString);
            }

            if (numberString === '0' && number.includes('.')) {
                return setNumber(number + numberString);
            }

            if (numberString !== '0' && !number.includes('.')) {
                return setNumber(numberString);
            }

            if (numberString === '0' && !number.includes('.')) {
                return;
            }

            return setNumber(number + numberString);
        }

        setNumber(number + numberString);
    }

    const setLastNumber = () => {
        calculateResult();
        if (number.endsWith('.')) {
            setPrevNumber(number.slice(0, -1));
        } else {
            setPrevNumber(number);
        }

        setNumber('0')
    }

    const reset = () => {
        setNumber('0');
        setPrevNumber('0');
        lastOperation.current = undefined;
        setFormula('');
    }

    const deleteOp = () => {
        let currentSign = '';
        let temporalNumber = number;

        if (number.includes('-')) {
            currentSign = '-'
            temporalNumber = number.substring(1)
        }

        if (temporalNumber.length > 1) {
            return setNumber(currentSign + temporalNumber.slice(0, -1))
        }
    }

    const toggleSign = () => {
        if (number.includes('-')) {
            return setNumber(number.replace('-', ''))
        }

        setNumber('-' + number)
    }

    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply
    }


    const subtractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.subtract
    }


    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add
    }


    const calculateResult = () => {
        const result = calculateSubResult();
        setFormula(`${result}`);
        lastOperation.current = undefined;
        setPrevNumber('0');
    }

    const calculateSubResult = (): number => {
        const [firstValue, operation, secondValue] = formula.split(' ');
        const numb1 = Number(firstValue);
        const numb2 = Number(secondValue);

        if (isNaN(numb2)) return numb1;

        switch (operation) {
            case Operator.add:
                return numb1 + numb2;
            case Operator.subtract:
                return numb1 - numb2;
            case Operator.multiply:
                return numb1 * numb2;
            case Operator.divide:
                return numb1 / numb2;
            default:
                throw new Error('Operation not implementad');
        }
    }




    return {
        //Properties
        number,
        prevNumber,
        formula,

        //Methods
        buildNumber,
        reset,
        deleteOp,
        toggleSign,
        addOperation,
        subtractOperation,
        multiplyOperation,
        divideOperation,
        calculateResult
    }
}
