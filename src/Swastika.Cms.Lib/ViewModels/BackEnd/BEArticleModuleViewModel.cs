﻿using System;
using System.Collections.Generic;
using System.Linq;
using Swastika.Cms.Lib.Models;
using Swastika.Domain.Data.ViewModels;
using Microsoft.EntityFrameworkCore.Storage;
using Newtonsoft.Json;
using Swastika.IO.Common.Helper;
using Swastika.IO.Domain.Core.ViewModels;
using Swastika.Cms.Lib.ViewModels.Info;
using System.Threading.Tasks;
using Swastika.Cms.Lib.ViewModels.FrontEnd;

namespace Swastika.Cms.Lib.ViewModels.BackEnd
{
    public class BEArticleModuleViewModel
        : ViewModelBase<SiocCmsContext, SiocArticleModule, BEArticleModuleViewModel>
    {
        #region Properties

        #region Models
        [JsonProperty("articleId")]
        public string ArticleId { get; set; }
        [JsonProperty("moduleId")]
        public int ModuleId { get; set; }
        [JsonProperty("isActived")]
        public bool IsActived { get; set; }
        [JsonProperty("description")]
        public string Description { get; set; }
        #endregion

        #region Views
        [JsonProperty("module")]
        public FEModuleViewModel Module { get; set; }
        #endregion

        #endregion

        #region Contructors

        public BEArticleModuleViewModel() : base()
        {
        }

        public BEArticleModuleViewModel(SiocArticleModule model, SiocCmsContext _context = null, IDbContextTransaction _transaction = null) : base(model, _context, _transaction)
        {
        }

        #endregion

        #region Overrides
        public override void ExpandView(SiocCmsContext _context = null, IDbContextTransaction _transaction = null)
        {
            var getModuleResult = FEModuleViewModel.Repository.GetSingleModel(m => m.Id == ModuleId && m.Specificulture == Specificulture);
            if (getModuleResult.IsSucceed)
            {
                this.Module = getModuleResult.Data;
            }
        }
        public override RepositoryResponse<bool> RemoveRelatedModels(BEArticleModuleViewModel view, SiocCmsContext _context = null, IDbContextTransaction _transaction = null)
        {
            return InfoModuleDataViewModel.Repository.RemoveListModel(d => d.ArticleId == view.ArticleId
                && d.ModuleId == view.ModuleId && d.Specificulture == view.Specificulture, _context, _transaction);
        }

       

        public override RepositoryResponse<bool> SaveSubModels(SiocArticleModule parent, SiocCmsContext _context = null, IDbContextTransaction _transaction = null)
        {
            RepositoryResponse<bool> result = new RepositoryResponse<bool>() { IsSucceed = true };
            foreach (var data in Module.Data.Items)
            {
                data.ArticleId = parent.ArticleId;
                data.ModuleId = parent.ModuleId;
                var saveResult = data.SaveModel(false, _context, _transaction);
                if (!saveResult.IsSucceed)
                {
                    result.Errors.AddRange(saveResult.Errors);
                    result.Exception = saveResult.Exception;
                }
                result.Data = result.IsSucceed = result.IsSucceed && saveResult.IsSucceed;
            }
            return result;
        }

        #region Async
        public override Task<RepositoryResponse<bool>> RemoveRelatedModelsAsync(BEArticleModuleViewModel view, SiocCmsContext _context = null, IDbContextTransaction _transaction = null)
        {
            return InfoModuleDataViewModel.Repository.RemoveListModelAsync(d => d.ArticleId == view.ArticleId
                && d.ModuleId == view.ModuleId && d.Specificulture == view.Specificulture, _context, _transaction);
        }
        public override async Task<RepositoryResponse<bool>> SaveSubModelsAsync(SiocArticleModule parent, SiocCmsContext _context = null, IDbContextTransaction _transaction = null)
        {
            RepositoryResponse<bool> result = new RepositoryResponse<bool>() { IsSucceed = true };
            foreach (var data in Module.Data.Items)
            {
                data.ArticleId = parent.ArticleId;
                data.ModuleId = parent.ModuleId;
                var saveResult = await data.SaveModelAsync(false, _context, _transaction);
                if (!saveResult.IsSucceed)
                {
                    result.Errors.AddRange(saveResult.Errors);
                    result.Exception = saveResult.Exception;
                }
                result.Data = result.IsSucceed = result.IsSucceed && saveResult.IsSucceed;
            }
            return result;
        }
        #endregion
        #endregion

        #region Expands

        #endregion

    }
}