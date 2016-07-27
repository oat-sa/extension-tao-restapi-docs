<?php
/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2016  (original work) Open Assessment Technologies SA;
 *
 * @author Alexander Zagovorichev <zagovorichev@1pt.com>
 */

namespace oat\taoRestApiDocs\controller;
use oat\taoRestApiDocs\model\exception\RestApiDocsException;
use oat\taoRestApiDocs\model\service\docs\DocsService;

/**
 * Sample controller
 *
 * @author Open Assessment Technologies SA
 * @package taoRestApiDocs
 * @license GPL-2.0
 *
 */
class TaoRestApiDocs extends \tao_actions_CommonModule
{

    /**
     * initialize the services
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * A possible entry point to tao
     */
    public function index()
    {

        try {
            $this->getServiceManager()->get(DocsService::SERVICE_ID)->getDocs();
            $this->setView('TaoRestApiDocs/swagger.tpl');
        } catch (RestApiDocsException $e) {
            $this->setData('message', $e->getMessage());
            $this->setView('TaoRestApiDocs/exception.tpl');
        }
    }

    public function docs()
    {
        /** @var DocsService $docsService */
        return $this->returnJson($this->getServiceManager()->get(DocsService::SERVICE_ID)->getDocs());
    }
}
