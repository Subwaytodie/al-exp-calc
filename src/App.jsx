import { useState } from 'react';
// import files here
import { experienceConditionalValues, oilTable } from './data.js'; 

function App() {
  // declaring the inputs
  const [selectedStage, setSelectedStage] = useState(oilTable[0]?.stage || "");
  const [drCheck, setDrCheck] = useState(false);
  const [fleetCheck, setFleetCheck] = useState(false);
  const [moodCheck, setMoodCheck] = useState(false);
  const [flagCheck, setFlagCheck] = useState(false);
  const [mvpCheck, setMvpCheck] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(100);
  const [targetLevel, setTargetLevel] = useState(125);
  const [experienceCurrent, setExperienceCurrent] = useState(0);

  //chosen stage object from oilTable array
  const activeRow = oilTable.find(row => String(row.stage) === String(selectedStage));
  const minArray = Number(currentLevel)-1;
  const maxArray = Number(targetLevel)-1;
  //getting experience needed for level up to the next level from the current level
  const activeLevel = experienceConditionalValues[minArray];
  const expValue = (drCheck ? activeLevel?.trueValue : activeLevel?.falseValue) ?? 0;  
  //clamping the input
  const clampRange = (input, minVal, maxVal) => {
    const minNumber = Number(minVal);
    const maxNumber = Number(maxVal);
    return Math.max(Math.min(input,maxNumber), minNumber);
  }
  // onChange handler
  const handleTypingChange = (e, stateSetter) => {
    // If the input is empty, leave it as an empty string so they can type a new number
    if (e.target.value === "") {
      stateSetter("");
    } else {
      stateSetter(Number(e.target.value));
      }
  };

  // onBlur handler
  const handleFinalValidation = (value, min, max, stateSetter) => {
    const rawNumber = Number(value.target.value) || 0;
    const minNumber = Number(min);
    const maxNumber = Number(max);
    const validatedValue = clampRange(rawNumber, minNumber, maxNumber);
    stateSetter(validatedValue);
  };

  // calculator function
  let rangeToCalculate = experienceConditionalValues.slice(minArray, maxArray);
  const expNeeded = rangeToCalculate.reduce((accumulator, currentRow) => {
    
    let valueToSum = drCheck ? currentRow.trueValue : currentRow.falseValue;
    return accumulator + valueToSum;  
  },0)
  const runsNeeded = (check1, check2, check3, check4, exp, array) =>{
    let fc = check1 ? array.singleExp : array.twoExp;
    let mc = check2 ? 1.2 : 1;
    let flc = check3 ? 1.5 : 1;
    let mvc = check4 ? 2 : 1;
    let xp = exp;
    let xpgain = fc*mc*flc*mvc*1.2;
    let runs = Math.ceil(xp/xpgain);
    return runs;
  }
  let runs = runsNeeded(fleetCheck,moodCheck,flagCheck,mvpCheck,expNeeded-experienceCurrent,activeRow)
  let oilcost = Math.ceil(runs * activeRow.oilcost);
  
  //website layout itself below here
  return (
  <>
    <header className="top-bar">
      Credits to Suchiguma for the initial Experience Values on which this calculator is based on. You can find his stuff on{" "}
      <a href="https://suchiguma.github.io/home/home-page/"  rel="noreferrer">
      Suchiguma's Homepage
      </a>.
    </header>
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ 
      lineHeight: '1.3',      // Crucial: Gives enough vertical space when text wraps
      marginBottom: '20px',  
      }}>Oil & Experience Calculator</h1>
      
      
      <div className = 'calculator-grid'>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Current Level:
          </label>
          <input style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '5px'}}
            type="number" 
            value={currentLevel} 
            min="1" 
            max="124" 
            onChange={(e) => handleTypingChange(e, setCurrentLevel)}
            onBlur={(e) => handleFinalValidation(e, 1, 124, setCurrentLevel)}/>
          <label style={{ display: 'block'}}>
            Current Experience:
          </label>
          <input type="range" value ={experienceCurrent} max={expValue} onChange={(e) => handleTypingChange(e, setExperienceCurrent)}/>
          <input className='slider-value-input'
            type="number" 
            value={experienceCurrent}
            max={expValue}            
            onChange={(e) => handleTypingChange(e, setExperienceCurrent)}
            onBlur={(e) => handleFinalValidation(e, 0, expValue, setExperienceCurrent)}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Target Level:
          </label>
          <input style={{ padding: '10px', width: '100%', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc'}} 
            type="number" 
            value={targetLevel} 
            min="2" 
            max="125" 
            onChange={(e) => handleTypingChange(e, setTargetLevel)}
            onBlur={(e) => handleFinalValidation(e, 2, 125, setTargetLevel)}/>
        </div> 
      
        {/* DROPDOWN SELECT - POPULATED VIA YOUR STAGE KEY */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Select Stage:
          </label>
          <select 
            value={selectedStage} 
            onChange={(e) => setSelectedStage(e.target.value)}
            style={{ padding: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {oilTable.map((row, index) => (
              <option key={index} value={row.stage}>
                Stage {row.stage}
              </option>
            ))}
          </select>
        </div>


        {/* CHECKBOXES TO ALTER CALCULATIONS */}
        {/* THE RIGHT COLUMN CONTROLLER */}
        <div>
  
  

          {/* 2. THE CLEAN INNER GRID CONTAINER */}
          <div className="checkbox-grid">
            <label className="checkbox-label">
              <input type="checkbox" style={{ cursor: 'pointer' }} onChange={(e) => 
              { const checkValue = e.target.checked;
                setDrCheck(checkValue);
                const newMaxValue = checkValue ? activeLevel.trueValue : activeLevel.falseValue;
                if (newMaxValue < experienceCurrent){
                  setExperienceCurrent(newMaxValue);
                }
              }} />
              <span>Is the ship UR/DR?</span>
            </label>

            <label className="checkbox-label">
              <input type="checkbox" onChange={(e) => setFlagCheck (e.target.checked)}/>
              <span>Flagship?</span>
            </label>

            <label className="checkbox-label">
              <input type="checkbox" onChange={(e) => setFleetCheck (e.target.checked)}/>
              <span>Using only 1 Fleet?</span>
            </label>

            <label className="checkbox-label">
              <input type="checkbox" onChange={(e) => setMoodCheck (e.target.checked)}/>
              <span>{"Mood > 120?"}</span>
            </label>

            <label className="checkbox-label full-span">
              <input type="checkbox" onChange={(e) => setMvpCheck (e.target.checked)}/>
              <span>Are you MVP maxing?</span>
            </label>
          </div>
        </div>
      </div>

      {/* CALCULATION OUTPUT AREA */}
      <div>
        <h3>Calculated Requirement:</h3>
        <p>
          Experience needed to reach {targetLevel}: {expNeeded-experienceCurrent}<br/>
          Total Runs of {activeRow.stage} needed to reach {targetLevel}: {runs}
          <br/>Total Oil spent: {oilcost} 
        </p>

        {/* Live Debug Meta Box to see active values change */}
        {/*activeRow && (
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #cbd5e0', fontSize: '13px', color: '#4a5568' }}>
            <strong>Active Row Specs:</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '20px', alignItems: 'center' }}>
              <li>Stage: {activeRow.stage}</li>
              <li>Base Oil Cost: {activeRow.oilcost}</li>
              <li>Single Exp: {activeRow.singleExp}</li>
              <li>Two Exp: {activeRow.twoExp}</li>
              <li>Current Level: {currentLevel}</li>
              <li>Target Level: {targetLevel}</li>
              <li>{runsNeeded(fleetCheck,moodCheck,flagCheck,mvpCheck,expNeeded-experienceCurrent,activeRow)}</li>
            </ul>
          </div>
        )*/}
      </div>
    </div>
  </>
  );
  
}

export default App;
