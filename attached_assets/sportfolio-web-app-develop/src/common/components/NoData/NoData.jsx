import NoDataImage from 'assets/no-data.jpg';

const NoData = ({noDataText = 'Your List is Clean... Lets Start Over!'}) => {
  return (
    <div className="p-10 text-center bg-white rounded-lg">
      <img src={NoDataImage} alt='No Data' style={{maxWidth: '400px'}} className='m-auto' />
      <h4>{noDataText}</h4>
    </div>
  );
};

export default NoData;