# Insurance Data Analysis Project

## Project Overview
This project focuses on developing a machine learning model to predict insurance pricing. 

The data sources are : age, sex, bmi, children, smoker, region and the related charge.

The goal is to predict charge for new clients based on their own data.

## Project Structure
```

├── data_src/           # Source data directory
├── models/             # Trained models directory
├── data_visualisation.ipynb      # Notebook for data visualization
├── model_construct.ipynb         # Notebook for model building
├── model_feature_importance.ipynb # Notebook for analyzing feature importance
└── requirements.txt    # Project dependencies
```
## Dependencies
The project requires several Python packages, including:
- pandas
- numpy
- scikit-learn
- xgboost
- matplotlib
- seaborn
- plotly
- jupyter

All dependencies are listed in `requirements.txt` and can be installed using:
```bash
pip install -r requirements.txt
```

## Notebooks Description
1. **data_visualisation.ipynb**
   - Explores and visualizes the insurance dataset
   - Creates various plots and statistical analyses
   
2. **model_construct.ipynb**
   - Implements machine learning models
   - Includes data preprocessing and model training
   
3. **model_feature_importance.ipynb**
   - Analyzes the importance of different features
   - Provides insights into model decisions

## Getting Started
1. Clone the repository
2. Install the required dependencies:
```shell script
pip install -r requirements.txt
```

3. Launch Jupyter Notebook:
```shell script
jupyter notebook
```

4. Open the notebooks in order:
   - Start with data_visualisation.ipynb
   - Then proceed to model_construct.ipynb
   - Finally, explore model_feature_importance.ipynb

## Models
Trained models are saved in the `models/` directory for future use and reproducibility.

## Data
The source data is stored in the `data_src/` directory. Please ensure you have the necessary permissions to access the data files.